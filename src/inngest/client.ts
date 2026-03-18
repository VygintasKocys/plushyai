import { Inngest, eventType, staticSchema } from "inngest";

export const imageGenerateEvent = eventType("plushify/image.generate", {
  schema: staticSchema<{
    generationId: string;
    userId: string;
    style: string;
    styleName: string;
    originalImageUrl: string;
  }>(),
});

export const inngest = new Inngest({ id: "plushify" });
