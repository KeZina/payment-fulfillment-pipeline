import { sql } from "drizzle-orm";
import { check } from "drizzle-orm/gel-core";
import { integer, numeric, pgTable, text } from "drizzle-orm/pg-core";

export const item = pgTable(
  "item",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: text("name").notNull(),
    description: text("description"),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    discount: numeric("discount", { precision: 4, scale: 2 })
      .default("0.00")
      .notNull(),
    quantity: integer("quantity").default(0).notNull(),
    salePrice: numeric("sale_price", {
      precision: 10,
      scale: 2,
    })
      .generatedAlwaysAs(sql`price * (1 - discount)`)
      .notNull(),
  },
  (table) => [
    check("item_price_check", sql`${table.price} >= 0`),
    check("item_quantity_check", sql`${table.quantity} >= 0`),
    check(
      "item_discount_check",
      sql`${table.discount} >= 0 AND ${table.discount} <= 1`,
    ),
  ],
);
