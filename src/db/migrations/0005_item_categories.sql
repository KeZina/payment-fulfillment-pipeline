CREATE TABLE "item_category" (
	"slug" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"content_type" text NOT NULL,
	"image_data" text NOT NULL
);
--> statement-breakpoint
INSERT INTO "item_category" ("slug", "label", "content_type", "image_data") VALUES ('uncategorized', 'Uncategorized', 'image/png', 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUAAcXjT6dsRk+2AAAAAElFTkSuQmCC') ON CONFLICT ("slug") DO NOTHING;--> statement-breakpoint
ALTER TABLE "item" ADD COLUMN "category_slug" text;--> statement-breakpoint
UPDATE "item" SET "category_slug" = 'uncategorized' WHERE "category_slug" IS NULL;--> statement-breakpoint
ALTER TABLE "item" ALTER COLUMN "category_slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_category_slug_item_category_slug_fk" FOREIGN KEY ("category_slug") REFERENCES "public"."item_category"("slug") ON DELETE no action ON UPDATE no action;
