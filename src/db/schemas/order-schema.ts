import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { braintreeSandboxTransaction } from "./braintree-sandbox-transaction-schema";
import { item } from "./item-schema";

export const order = pgTable(
  "order",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    idempotencyKey: uuid("idempotency_key")
      .notNull()
      .unique()
      .references(() => braintreeSandboxTransaction.idempotencyKey),
    status: text("status").notNull(),
    totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    recipientName: text("recipient_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    deliveryAddress: text("delivery_address").notNull(),
    deliveryInstructions: text("delivery_instructions").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("order_user_id_idx").on(table.userId),
    check("order_total_amount_check", sql`${table.totalAmount} > 0`),
  ],
);

export const orderLineItem = pgTable(
  "order_line_item",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => order.id, { onDelete: "cascade" }),
    itemId: integer("item_id").references(() => item.id, {
      onDelete: "set null",
    }),
    itemName: text("item_name").notNull(),
    unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull(),
    lineTotal: numeric("line_total", { precision: 10, scale: 2 }).notNull(),
  },
  (table) => [
    index("order_line_item_order_id_idx").on(table.orderId),
    check("order_line_item_quantity_check", sql`${table.quantity} > 0`),
    check(
      "order_line_item_unit_price_check",
      sql`${table.unitPrice} >= 0`,
    ),
    check("order_line_item_line_total_check", sql`${table.lineTotal} >= 0`),
  ],
);
