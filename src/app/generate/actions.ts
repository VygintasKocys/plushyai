"use server";

import { headers } from "next/headers";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateImage } from "ai";
import { eq, sql } from "drizzle-orm";
import { z } from "zod/v4";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PLUSHIE_STYLES } from "@/lib/mock-data";
import { user, generation } from "@/lib/schema";
import { upload, deleteFile } from "@/lib/storage";

const VALID_STYLE_IDS = PLUSHIE_STYLES.map((s) => s.id);

const generateSchema = z.object({
  style: z.literal(VALID_STYLE_IDS[0] as "classic").or(
    z.enum(VALID_STYLE_IDS.slice(1) as [string, ...string[]])
  ),
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

export async function generatePlushie(formData: FormData) {
  // 2.2 — Authentication check
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "unauthorized" as const };
  }

  // 2.3 — Input validation
  const styleValue = formData.get("style");
  const imageFile = formData.get("imageFile");

  const parsed = generateSchema.safeParse({ style: styleValue });
  if (!parsed.success) {
    return { error: "validation_failed" as const };
  }

  if (
    !imageFile ||
    !(imageFile instanceof File) ||
    imageFile.size === 0
  ) {
    return { error: "validation_failed" as const };
  }

  if (imageFile.size > MAX_FILE_SIZE) {
    return { error: "validation_failed" as const };
  }

  if (!ALLOWED_TYPES.includes(imageFile.type)) {
    return { error: "validation_failed" as const };
  }

  const { style } = parsed.data;

  // 2.4 — Credit check
  const [currentUser] = await db
    .select({ credits: user.credits })
    .from(user)
    .where(eq(user.id, session.user.id));

  if (!currentUser || currentUser.credits < 1) {
    return { error: "insufficient_credits" as const };
  }

  // 2.5 — Upload original image to storage
  const originalBuffer = Buffer.from(await imageFile.arrayBuffer());
  const ext = imageFile.name.split(".").pop()?.toLowerCase() || "png";
  const originalFilename = `${crypto.randomUUID()}.${ext}`;

  const originalResult = await upload(
    originalBuffer,
    originalFilename,
    "plushify/originals",
    { maxSize: MAX_FILE_SIZE }
  );

  // 2.6 — Call AI to generate the plushified image
  const styleDef = PLUSHIE_STYLES.find((s) => s.id === style);
  const styleName = styleDef?.name ?? "Classic Plushie";

  let generatedImageBuffer: Buffer;
  try {
    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY!,
    });

    const { image } = await generateImage({
      model: openrouter.imageModel("google/gemini-2.5-flash-image"),
      prompt: {
        text: `Transform the subject(s) in this image into an adorable ${styleName} plushie/stuffed toy. Preserve the pose, composition, and context of the original image. The result should look like a real, high-quality plush toy with soft fabric textures, stitched details, and button eyes where appropriate for the style.`,
        images: [originalBuffer],
      },
    });

    generatedImageBuffer = Buffer.from(image.uint8Array);
  } catch {
    // Clean up the uploaded original on failure
    await deleteFile(originalResult.url);
    return { error: "generation_failed" as const };
  }

  // 2.7 — Upload generated image to storage
  const generatedFilename = `${crypto.randomUUID()}.png`;
  const generatedResult = await upload(
    generatedImageBuffer,
    generatedFilename,
    "plushify/generated",
    { maxSize: MAX_FILE_SIZE }
  );

  // 2.8 — Deduct credit atomically
  const updateResult = await db
    .update(user)
    .set({ credits: sql`${user.credits} - 1` })
    .where(
      sql`${user.id} = ${session.user.id} AND ${user.credits} > 0`
    );

  if (updateResult.count === 0) {
    // Race condition — no credit was deducted, clean up
    await deleteFile(originalResult.url);
    await deleteFile(generatedResult.url);
    return { error: "insufficient_credits" as const };
  }

  // 2.9 — Insert generation record
  const title = `${styleName} Plushie`;
  const [record] = await db
    .insert(generation)
    .values({
      userId: session.user.id,
      title,
      style,
      originalImageUrl: originalResult.url,
      generatedImageUrl: generatedResult.url,
      creditCost: 1,
    })
    .returning({
      id: generation.id,
      originalImageUrl: generation.originalImageUrl,
      generatedImageUrl: generation.generatedImageUrl,
      style: generation.style,
      createdAt: generation.createdAt,
    });

  return {
    success: true as const,
    generation: record,
  };
}
