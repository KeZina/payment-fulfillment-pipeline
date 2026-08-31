import "server-only";

import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  braintreeSandboxTransaction,
  item,
  order,
  orderLineItem,
} from "@/db/schemas";
import { SandboxCheckoutLedgerStatus } from "@/constants";
import { ZERO_CENTS } from "@/constants/money";
import type { CheckoutLineItem, CheckoutQuoteResult } from "@/types";
import { formatCents, priceToCents } from "@/utils/server";
import type {
  CheckoutItemSnapshot,
  FulfillAndPersistCheckoutParams,
  GetSandboxCheckoutLedgerStateParams,
  PersistCheckoutOrderParams,
  RecordSuccessfulSandboxCheckoutParams,
  SandboxCheckoutLedgerState,
} from "./checkout.types";

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

function buildOrderLineItemValues(
  orderId: string,
  itemSnapshots: CheckoutItemSnapshot[],
) {
  return itemSnapshots.map((itemSnapshot) => {
    const unitCents = priceToCents(itemSnapshot.salePrice) ?? ZERO_CENTS;

    return {
      orderId,
      itemId: itemSnapshot.id,
      itemName: itemSnapshot.name,
      unitPrice: itemSnapshot.salePrice,
      quantity: itemSnapshot.quantity,
      lineTotal: formatCents(unitCents * BigInt(itemSnapshot.quantity)),
    };
  });
}

async function hasPersistedOrderLineItems(idempotencyKey: string) {
  const [existingOrder] = await db
    .select({ id: order.id })
    .from(order)
    .where(eq(order.idempotencyKey, idempotencyKey))
    .limit(1);

  if (!existingOrder) {
    return false;
  }

  const [existingLine] = await db
    .select({ id: orderLineItem.id })
    .from(orderLineItem)
    .where(eq(orderLineItem.orderId, existingOrder.id))
    .limit(1);

  return Boolean(existingLine);
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
      itemSnapshots: braintreeSandboxTransaction.itemSnapshots,
      requestFingerprint: braintreeSandboxTransaction.requestFingerprint,
      status: braintreeSandboxTransaction.transactionStatus,
      userId: braintreeSandboxTransaction.userId,
    })
    .from(braintreeSandboxTransaction)
    .where(eq(braintreeSandboxTransaction.idempotencyKey, idempotencyKey))
    .limit(1);

  if (!transaction) {
    return { status: SandboxCheckoutLedgerStatus.Missing };
  }

  if (
    transaction.userId !== userId ||
    transaction.requestFingerprint !== requestFingerprint
  ) {
    return { status: SandboxCheckoutLedgerStatus.Conflict };
  }

  if (!transaction.inventoryApplied) {
    return {
      status: SandboxCheckoutLedgerStatus.Unfulfilled,
      itemSnapshots: transaction.itemSnapshots,
      transaction: {
        id: transaction.id,
        status: transaction.status,
        amount: transaction.amount,
        currency: transaction.currency,
      },
    };
  }

  return {
    status: SandboxCheckoutLedgerStatus.Fulfilled,
    transaction: {
      id: transaction.id,
      status: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency,
    },
    itemSnapshots: transaction.itemSnapshots,
  };
}

// Used only to recover an order whose inventory was already decremented by a
// prior request but whose order/line-item rows never made it to disk (e.g. the
// process crashed between the two). Inserts both in a single statement so this
// recovery path can't itself leave a half-written order behind.
async function persistOrderAtomically({
  idempotencyKey,
  userId,
  checkoutDetails,
  itemSnapshots,
  transaction,
}: PersistCheckoutOrderParams): Promise<void> {
  const orderId = crypto.randomUUID();
  const lineItemSnapshotsJson = JSON.stringify(
    buildOrderLineItemValues(orderId, itemSnapshots).map((lineItem) => ({
      itemId: lineItem.itemId,
      itemName: lineItem.itemName,
      unitPrice: lineItem.unitPrice,
      quantity: lineItem.quantity,
      lineTotal: lineItem.lineTotal,
    })),
  );

  await db.execute(sql`
    WITH inserted_order AS (
      INSERT INTO ${order} (
        "id",
        "user_id",
        "idempotency_key",
        "status",
        "total_amount",
        "currency",
        "recipient_name",
        "email",
        "phone",
        "delivery_address",
        "delivery_instructions"
      )
      SELECT
        ${orderId}::uuid,
        ${userId},
        ${idempotencyKey}::uuid,
        ${transaction.status},
        ${transaction.amount},
        ${transaction.currency},
        ${checkoutDetails.fullName},
        ${checkoutDetails.email},
        ${checkoutDetails.phone},
        ${checkoutDetails.deliveryAddress},
        ${checkoutDetails.deliveryInstructions}
      WHERE NOT EXISTS (
        SELECT 1 FROM ${order} WHERE "idempotency_key" = ${idempotencyKey}::uuid
      )
      RETURNING "id"
    ),
    resolved_order AS (
      SELECT "id" FROM inserted_order
      UNION ALL
      SELECT existing_order."id"
      FROM ${order} AS existing_order
      WHERE existing_order."idempotency_key" = ${idempotencyKey}::uuid
        AND NOT EXISTS (SELECT 1 FROM inserted_order)
    ),
    inserted_line_items AS (
      INSERT INTO ${orderLineItem} (
        "order_id",
        "item_id",
        "item_name",
        "unit_price",
        "quantity",
        "line_total"
      )
      SELECT
        resolved_order."id",
        line_item."itemId"::integer,
        line_item."itemName",
        line_item."unitPrice"::numeric,
        line_item."quantity"::integer,
        line_item."lineTotal"::numeric
      FROM resolved_order
      CROSS JOIN jsonb_to_recordset(${lineItemSnapshotsJson}::jsonb) AS line_item(
        "itemId" integer,
        "itemName" text,
        "unitPrice" text,
        "quantity" integer,
        "lineTotal" text
      )
      WHERE NOT EXISTS (
        SELECT 1
        FROM ${orderLineItem}
        WHERE "order_id" = resolved_order."id"
      )
    )
    SELECT 1
  `);
}

export async function fulfillAndPersistCheckout({
  idempotencyKey,
  items: requestedItems,
  requestFingerprint,
  userId,
  checkoutDetails,
  itemSnapshots,
  transaction,
}: FulfillAndPersistCheckoutParams): Promise<SandboxCheckoutLedgerState> {
  if (await hasPersistedOrderLineItems(idempotencyKey)) {
    return getSandboxCheckoutLedgerState({
      idempotencyKey,
      requestFingerprint,
      userId,
    });
  }

  const ledgerState = await getSandboxCheckoutLedgerState({
    idempotencyKey,
    requestFingerprint,
    userId,
  });

  if (ledgerState.status === SandboxCheckoutLedgerStatus.Conflict) {
    return ledgerState;
  }

  if (
    ledgerState.status === SandboxCheckoutLedgerStatus.Fulfilled &&
    ledgerState.itemSnapshots
  ) {
    await persistOrderAtomically({
      idempotencyKey,
      userId,
      checkoutDetails,
      itemSnapshots: ledgerState.itemSnapshots,
      transaction: ledgerState.transaction,
    });

    return getSandboxCheckoutLedgerState({
      idempotencyKey,
      requestFingerprint,
      userId,
    });
  }

  if (ledgerState.status !== SandboxCheckoutLedgerStatus.Unfulfilled) {
    return ledgerState;
  }

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
  const orderId = crypto.randomUUID();
  const lineItemSnapshotsJson = JSON.stringify(
    buildOrderLineItemValues(orderId, itemSnapshots).map((lineItem) => ({
      itemId: lineItem.itemId,
      itemName: lineItem.itemName,
      unitPrice: lineItem.unitPrice,
      quantity: lineItem.quantity,
      lineTotal: lineItem.lineTotal,
    })),
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
    ),
    fulfillment_success AS (
      SELECT (
        SELECT count(*) FROM updated_items
      ) = ${sortedRequestedItems.length} AS "ok"
    ),
    ledger_update AS (
      UPDATE ${braintreeSandboxTransaction} AS sandbox_transaction
      SET "inventory_applied" = true
      WHERE sandbox_transaction."idempotency_key" = ${idempotencyKey}
        AND sandbox_transaction."request_fingerprint" = ${requestFingerprint}
        AND sandbox_transaction."user_id" = ${userId}
        AND sandbox_transaction."inventory_applied" = false
        AND EXISTS (SELECT 1 FROM eligible_transaction)
        AND (SELECT "ok" FROM fulfillment_success)
      RETURNING sandbox_transaction."idempotency_key"
    ),
    inserted_order AS (
      INSERT INTO ${order} (
        "id",
        "user_id",
        "idempotency_key",
        "status",
        "total_amount",
        "currency",
        "recipient_name",
        "email",
        "phone",
        "delivery_address",
        "delivery_instructions"
      )
      SELECT
        ${orderId}::uuid,
        ${userId},
        ${idempotencyKey}::uuid,
        ${transaction.status},
        ${transaction.amount},
        ${transaction.currency},
        ${checkoutDetails.fullName},
        ${checkoutDetails.email},
        ${checkoutDetails.phone},
        ${checkoutDetails.deliveryAddress},
        ${checkoutDetails.deliveryInstructions}
      FROM fulfillment_success
      WHERE "ok"
        AND EXISTS (SELECT 1 FROM ledger_update)
        AND NOT EXISTS (
          SELECT 1
          FROM ${order}
          WHERE "idempotency_key" = ${idempotencyKey}::uuid
        )
      RETURNING "id"
    ),
    resolved_order AS (
      SELECT "id" FROM inserted_order
      UNION ALL
      SELECT existing_order."id"
      FROM ${order} AS existing_order
      WHERE existing_order."idempotency_key" = ${idempotencyKey}::uuid
        AND EXISTS (SELECT 1 FROM fulfillment_success WHERE "ok")
        AND NOT EXISTS (SELECT 1 FROM inserted_order)
    ),
    inserted_line_items AS (
      INSERT INTO ${orderLineItem} (
        "order_id",
        "item_id",
        "item_name",
        "unit_price",
        "quantity",
        "line_total"
      )
      SELECT
        resolved_order."id",
        line_item."itemId"::integer,
        line_item."itemName",
        line_item."unitPrice"::numeric,
        line_item."quantity"::integer,
        line_item."lineTotal"::numeric
      FROM resolved_order
      CROSS JOIN jsonb_to_recordset(${lineItemSnapshotsJson}::jsonb) AS line_item(
        "itemId" integer,
        "itemName" text,
        "unitPrice" text,
        "quantity" integer,
        "lineTotal" text
      )
      WHERE EXISTS (SELECT 1 FROM fulfillment_success WHERE "ok")
        AND NOT EXISTS (
          SELECT 1
          FROM ${orderLineItem}
          WHERE "order_id" = resolved_order."id"
        )
    )
    SELECT 1
  `);

  const fulfilledState = await getSandboxCheckoutLedgerState({
    idempotencyKey,
    requestFingerprint,
    userId,
  });

  if (
    fulfilledState.status !== SandboxCheckoutLedgerStatus.Fulfilled ||
    !(await hasPersistedOrderLineItems(idempotencyKey))
  ) {
    throw new Error(
      "Sandbox checkout inventory and order persistence did not complete.",
    );
  }

  return fulfilledState;
}

export async function recordSuccessfulSandboxCheckout({
  idempotencyKey,
  items: requestedItems,
  requestFingerprint,
  transaction,
  userId,
  checkoutDetails,
  itemSnapshots,
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
      itemSnapshots,
    })
    .onConflictDoNothing();

  return fulfillAndPersistCheckout({
    idempotencyKey,
    items: requestedItems,
    requestFingerprint,
    userId,
    checkoutDetails,
    itemSnapshots,
    transaction,
  });
}

export async function getCheckoutQuote(
  requestedItems: CheckoutLineItem[],
): Promise<CheckoutQuoteResult> {
  const rows = await db
    .select({
      id: item.id,
      name: item.name,
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
  const itemSnapshots = [];

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
    itemSnapshots.push({
      id: currentItem.id,
      name: currentItem.name,
      salePrice: currentItem.salePrice,
      quantity: requestedItem.quantity,
    });
  }

  if (totalCents <= ZERO_CENTS) {
    return { success: false };
  }

  return { success: true, amount: formatCents(totalCents), items: itemSnapshots };
}
