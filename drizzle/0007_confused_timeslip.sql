ALTER TABLE "generation" ALTER COLUMN "generated_image_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "generation" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "generation" ADD COLUMN "error_message" text;