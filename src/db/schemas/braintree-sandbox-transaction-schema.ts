import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const braintreeSandboxTransaction = pgTable(
  "braintree_sandbox_transaction",
  {
    idempotencyKey: uuid("idempotency_key").primaryKey(),
    requestFingerprint: text("request_fingerprint").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    transactionId: text("transaction_id").notNull(),
    transactionStatus: text("transaction_status").notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    inventoryApplied: boolean("inventory_applied").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("braintree_sandbox_transaction_transaction_id_uidx").on(
      table.transactionId,
    ),
    index("braintree_sandbox_transaction_user_id_idx").on(table.userId),
    check(
      "braintree_sandbox_transaction_amount_check",
      sql`${table.amount} > 0`,
    ),
  ],
);
