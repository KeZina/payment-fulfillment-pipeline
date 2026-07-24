import { pgTable, integer, text, numeric } from "drizzle-orm/pg-core";

export const item = pgTable("item", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
});
