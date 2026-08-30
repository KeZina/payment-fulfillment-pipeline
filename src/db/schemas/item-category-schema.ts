import { pgTable, text } from "drizzle-orm/pg-core";

export const itemCategory = pgTable("item_category", {
  slug: text("slug").primaryKey(),
  label: text("label").notNull(),
  contentType: text("content_type").notNull(),
  imageData: text("image_data").notNull(),
});
