CREATE TABLE "generation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"style" text NOT NULL,
	"original_image_url" text NOT NULL,
	"generated_image_url" text NOT NULL,
	"credit_cost" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "credits" integer DEFAULT 3 NOT NULL;--> statement-breakpoint
ALTER TABLE "generation" ADD CONSTRAINT "generation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "generation_user_id_idx" ON "generation" USING btree ("user_id");