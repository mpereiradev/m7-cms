ALTER TABLE "post_translations" ADD COLUMN "seo_title" varchar(500);--> statement-breakpoint
ALTER TABLE "post_translations" ADD COLUMN "seo_description" text;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "cover_media_id" uuid;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_media_id_media_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;