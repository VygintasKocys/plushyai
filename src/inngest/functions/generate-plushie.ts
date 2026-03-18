import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateImage } from "ai";
import { eq, sql } from "drizzle-orm";
import { inngest, imageGenerateEvent } from "@/inngest/client";
import { db } from "@/lib/db";
import { generation, user } from "@/lib/schema";
import { upload } from "@/lib/storage";

export const generatePlushieFunction = inngest.createFunction(
  {
    id: "generate-plushie",
    retries: 3,
    triggers: [imageGenerateEvent],
    concurrency: [
      { limit: 2, key: "event.data.userId", scope: "fn" },
      { limit: 10, scope: "fn" },
    ],
    rateLimit: { limit: 5, period: "1m", key: "event.data.userId" },
    onFailure: async ({ event }) => {
      const originalEvent = event.data.event;
      const { generationId, userId } = originalEvent.data;
      const errorMessage =
        event.data.error?.message ?? "Generation failed after all retries";

      // Mark generation as failed
      await db
        .update(generation)
        .set({ status: "failed", errorMessage })
        .where(eq(generation.id, generationId));

      // Refund 1 credit
      await db
        .update(user)
        .set({ credits: sql`${user.credits} + 1` })
        .where(eq(user.id, userId));
    },
  },
  async ({ event, step }) => {
    const { generationId, styleName, originalImageUrl } = event.data;

    // Step 1: Mark as processing
    await step.run("mark-processing", async () => {
      await db
        .update(generation)
        .set({ status: "processing" })
        .where(eq(generation.id, generationId));
    });

    // Step 2: Fetch original image, generate plushie via AI, and upload result.
    // Combined into one step to avoid storing large base64 image data in Inngest
    // step outputs (4MB limit). Only the small URL string is persisted.
    const generatedImageUrl = await step.run(
      "generate-and-upload",
      async () => {
        // Fetch original image
        const url = originalImageUrl.startsWith("/")
          ? `${process.env.NEXT_PUBLIC_APP_URL}${originalImageUrl}`
          : originalImageUrl;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch original image: ${response.status}`
          );
        }
        const originalBuffer = Buffer.from(await response.arrayBuffer());

        // Call AI generation
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

        // Upload generated image
        const generatedBuffer = Buffer.from(image.uint8Array);
        const filename = `${crypto.randomUUID()}.png`;
        const result = await upload(
          generatedBuffer,
          filename,
          "plushify/generated"
        );
        return result.url;
      }
    );

    // Step 3: Mark as completed
    await step.run("mark-completed", async () => {
      await db
        .update(generation)
        .set({ status: "completed", generatedImageUrl })
        .where(eq(generation.id, generationId));
    });
  }
);
