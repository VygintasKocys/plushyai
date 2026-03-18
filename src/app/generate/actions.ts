"use server";

import { headers } from "next/headers";
import { eq, sql } from "drizzle-orm";
import { z } from "zod/v4";
import { inngest, imageGenerateEvent } from "@/inngest/client";
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
  // 1 — Authentication check
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "unauthorized" as const };
  }

  // 2 — Input validation
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

  // 3 — Credit check
  const [currentUser] = await db
    .select({ credits: user.credits })
    .from(user)
    .where(eq(user.id, session.user.id));

  if (!currentUser || currentUser.credits < 1) {
    return { error: "insufficient_credits" as const };
  }

  // 4 — Upload original image to storage
  const originalBuffer = Buffer.from(await imageFile.arrayBuffer());
  const ext = imageFile.name.split(".").pop()?.toLowerCase() || "png";
  const originalFilename = `${crypto.randomUUID()}.${ext}`;

  const originalResult = await upload(
    originalBuffer,
    originalFilename,
    "plushify/originals",
    { maxSize: MAX_FILE_SIZE }
  );

  // 5 — Deduct credit atomically
  const updateResult = await db
    .update(user)
    .set({ credits: sql`${user.credits} - 1` })
    .where(
      sql`${user.id} = ${session.user.id} AND ${user.credits} > 0`
    );

  if (updateResult.count === 0) {
    await deleteFile(originalResult.url);
    return { error: "insufficient_credits" as const };
  }

  // 6 — Insert generation record with pending status
  const styleDef = PLUSHIE_STYLES.find((s) => s.id === style);
  const styleName = styleDef?.name ?? "Classic Plushie";
  const title = `${styleName} Plushie`;

  const [record] = await db
    .insert(generation)
    .values({
      userId: session.user.id,
      title,
      style,
      originalImageUrl: originalResult.url,
      status: "pending",
      creditCost: 1,
    })
    .returning({ id: generation.id });

  if (!record) {
    return { error: "generation_failed" as const };
  }

  // 7 — Dispatch Inngest event
  try {
    await inngest.send(
      imageGenerateEvent.create({
        generationId: record.id,
        userId: session.user.id,
        style,
        styleName,
        originalImageUrl: originalResult.url,
      })
    );
  } catch {
    // Refund credit, clean up record and uploaded file
    await db
      .update(user)
      .set({ credits: sql`${user.credits} + 1` })
      .where(eq(user.id, session.user.id));
    await db.delete(generation).where(eq(generation.id, record.id));
    await deleteFile(originalResult.url);
    return { error: "generation_failed" as const };
  }

  return {
    success: true as const,
    generationId: record.id,
  };
}
