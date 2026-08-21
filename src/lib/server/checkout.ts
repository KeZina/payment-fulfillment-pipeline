import "server-only";

import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { braintreeSandboxTransaction, item } from "@/db/schemas";
import type { CheckoutLineItem, CheckoutQuoteResult } from "@/types";
import type {
  GetSandboxCheckoutLedgerStateParams,
  FulfillSandboxCheckoutInventoryParams,
  RecordSuccessfulSandboxCheckoutParams,
  SandboxCheckoutLedgerState,
} from "./checkout.types";

const CENTS_PER_UNIT = BigInt(100);
const ZERO_CENTS = BigInt(0);

function priceToCents(price: string) {
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(price);

  if (!match) {
    return null;
  }

  const [, whole, fraction = ""] = match;

  return BigInt(whole) * CENTS_PER_UNIT + BigInt(fraction.padEnd(2, "0"));
}

function formatCents(cents: bigint) {
  const whole = cents / CENTS_PER_UNIT;
  const fraction = (cents % CENTS_PER_UNIT).toString().padStart(2, "0");

  return `${whole}.${fraction}`;
}

export function createSandboxCheckoutRequestFingerprint(
  requestedItems: CheckoutLineItem[],
  amount: string,
) {
  return JSON.stringify({
    amount,
    items: [...requestedItems].sort(
      (firstItem, secondItem) => firstItem.id - secondItem.id,
    ),
  });
}

export async function getSandboxCheckoutLedgerState({
  idempotencyKey,
  requestFingerprint,
  userId,
}: GetSandboxCheckoutLedgerStateParams): Promise<SandboxCheckoutLedgerState> {
  const [transaction] = await db
    .select({
      amount: braintreeSandboxTransaction.amount,
      currency: braintreeSandboxTransaction.currency,
      id: braintreeSandboxTransaction.transactionId,
      inventoryApplied: braintreeSandboxTransaction.inventoryApplied,
      requestFingerprint: braintreeSandboxTransaction.requestFingerprint,
      status: braintreeSandboxTransaction.transactionStatus,
      userId: braintreeSandboxTransaction.userId,
    })
    .from(braintreeSandboxTransaction)
    .where(eq(braintreeSandboxTransaction.idempotencyKey, idempotencyKey))
    .limit(1);

  if (!transaction) {
    return { status: "missing" };
  }

  if (
    transaction.userId !== userId ||
    transaction.requestFingerprint !== requestFingerprint
  ) {
    return { status: "conflict" };
  }

  if (!transaction.inventoryApplied) {
    return { status: "unfulfilled" };
  }

  return {
    status: "fulfilled",
    transaction: {
      id: transaction.id,
      status: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency,
    },
  };
}

export async function recordSuccessfulSandboxCheckout({
  idempotencyKey,
  items: requestedItems,
  requestFingerprint,
  transaction,
  userId,
}: RecordSuccessfulSandboxCheckoutParams): Promise<SandboxCheckoutLedgerState> {
  await db
    .insert(braintreeSandboxTransaction)
    .values({
      idempotencyKey,
      requestFingerprint,
      userId,
      transactionId: transaction.id,
      transactionStatus: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency,
    })
    .onConflictDoNothing();

  const ledgerState = await getSandboxCheckoutLedgerState({
    idempotencyKey,
    requestFingerprint,
    userId,
  });

  if (ledgerState.status !== "unfulfilled") {
    return ledgerState;
  }

  return fulfillSandboxCheckoutInventory({
    idempotencyKey,
    items: requestedItems,
    requestFingerprint,
    userId,
  });
}

export async function fulfillSandboxCheckoutInventory({
  idempotencyKey,
  items: requestedItems,
  requestFingerprint,
  userId,
}: FulfillSandboxCheckoutInventoryParams): Promise<SandboxCheckoutLedgerState> {
  const sortedRequestedItems = [...requestedItems].sort(
    (firstItem, secondItem) => firstItem.id - secondItem.id,
  );
  const requestedItemValues = sql.join(
    sortedRequestedItems.map(
      (requestedItem) =>
        sql`(${requestedItem.id}::integer, ${requestedItem.quantity}::integer)`,
    ),
    sql`, `,
  );

  await db.execute(sql`
    WITH requested_items ("id", "requested_quantity") AS (
      VALUES ${requestedItemValues}
    ),
    eligible_transaction AS MATERIALIZED (
      SELECT "idempotency_key"
      FROM ${braintreeSandboxTransaction}
      WHERE "idempotency_key" = ${idempotencyKey}
        AND "request_fingerprint" = ${requestFingerprint}
        AND "user_id" = ${userId}
        AND "inventory_applied" = false
      FOR UPDATE
    ),
    available_items AS MATERIALIZED (
      SELECT count(*)::integer AS "matched_count"
      FROM ${item} AS inventory
      INNER JOIN requested_items AS requested
        ON inventory."id" = requested."id"
      WHERE inventory."quantity" >= requested."requested_quantity"
    ),
    updated_items AS (
      UPDATE ${item} AS inventory
      SET "quantity" =
        inventory."quantity" - requested."requested_quantity"
      FROM requested_items AS requested
      WHERE inventory."id" = requested."id"
        AND inventory."quantity" >= requested."requested_quantity"
        AND EXISTS (SELECT 1 FROM eligible_transaction)
        AND (
          SELECT "matched_count" FROM available_items
        ) = ${sortedRequestedItems.length}
      RETURNING inventory."id"
    )
    UPDATE ${braintreeSandboxTransaction} AS sandbox_transaction
    SET "inventory_applied" = CASE
      WHEN (
        SELECT count(*) FROM updated_items
      ) = ${sortedRequestedItems.length}
        THEN true
      ELSE NULL
    END
    WHERE sandbox_transaction."idempotency_key" = ${idempotencyKey}
      AND sandbox_transaction."request_fingerprint" = ${requestFingerprint}
      AND sandbox_transaction."user_id" = ${userId}
      AND sandbox_transaction."inventory_applied" = false
      AND EXISTS (SELECT 1 FROM eligible_transaction)
  `);

  return getSandboxCheckoutLedgerState({
    idempotencyKey,
    requestFingerprint,
    userId,
  });
}

export async function getCheckoutQuote(
  requestedItems: CheckoutLineItem[],
): Promise<CheckoutQuoteResult> {
  const rows = await db
    .select({
      id: item.id,
      quantity: item.quantity,
      salePrice: item.salePrice,
    })
    .from(item)
    .where(
      inArray(
        item.id,
        requestedItems.map(({ id }) => id),
      ),
    );

  if (rows.length !== requestedItems.length) {
    return { success: false };
  }

  const rowsById = new Map(rows.map((row) => [row.id, row]));
  let totalCents = ZERO_CENTS;

  for (const requestedItem of requestedItems) {
    const currentItem = rowsById.get(requestedItem.id);
    const unitPrice = currentItem
      ? priceToCents(currentItem.salePrice)
      : null;

    if (
      !currentItem ||
      unitPrice === null ||
      currentItem.quantity < requestedItem.quantity
    ) {
      return { success: false };
    }

    totalCents += unitPrice * BigInt(requestedItem.quantity);
  }

  if (totalCents <= ZERO_CENTS) {
    return { success: false };
  }

  return { success: true, amount: formatCents(totalCents) };
}
