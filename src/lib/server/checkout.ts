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
  GetSandboxCheckoutLedgerStateParams,
  FulfillSandboxCheckoutInventoryParams,
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

export async function persistCheckoutOrder({
  idempotencyKey,
  userId,
  checkoutDetails,
  itemSnapshots,
  transaction,
}: PersistCheckoutOrderParams): Promise<void> {
  const [existingOrder] = await db
    .select({ id: order.id })
    .from(order)
    .where(eq(order.idempotencyKey, idempotencyKey))
    .limit(1);

  if (existingOrder) {
    const [existingLine] = await db
      .select({ id: orderLineItem.id })
      .from(orderLineItem)
      .where(eq(orderLineItem.orderId, existingOrder.id))
      .limit(1);

    if (existingLine) {
      return;
    }

    await db
      .insert(orderLineItem)
      .values(buildOrderLineItemValues(existingOrder.id, itemSnapshots));

    return;
  }

  const orderId = crypto.randomUUID();
  const lineItemValues = buildOrderLineItemValues(orderId, itemSnapshots);

  await db.batch([
    db.insert(order).values({
      id: orderId,
      userId,
      idempotencyKey,
      status: transaction.status,
      totalAmount: transaction.amount,
      currency: transaction.currency,
      recipientName: checkoutDetails.fullName,
      email: checkoutDetails.email,
      phone: checkoutDetails.phone,
      deliveryAddress: checkoutDetails.deliveryAddress,
      deliveryInstructions: checkoutDetails.deliveryInstructions,
    }),
    db.insert(orderLineItem).values(lineItemValues),
  ]);
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

  const ledgerState = await getSandboxCheckoutLedgerState({
    idempotencyKey,
    requestFingerprint,
    userId,
  });

  if (ledgerState.status === SandboxCheckoutLedgerStatus.Fulfilled) {
    try {
      if (ledgerState.itemSnapshots) {
        await persistCheckoutOrder({
          idempotencyKey,
          userId,
          checkoutDetails,
          itemSnapshots: ledgerState.itemSnapshots,
          transaction: ledgerState.transaction,
        });
      }
    } catch (error: unknown) {
      console.error(
        "Sandbox checkout order persistence failed:",
        error instanceof Error ? error.message : "Unknown database error.",
      );
    }

    return ledgerState;
  }

  if (ledgerState.status !== SandboxCheckoutLedgerStatus.Unfulfilled) {
    return ledgerState;
  }

  const fulfilledCheckout = await fulfillSandboxCheckoutInventory({
    idempotencyKey,
    items: requestedItems,
    requestFingerprint,
    userId,
  });

  if (fulfilledCheckout.status === SandboxCheckoutLedgerStatus.Fulfilled) {
    try {
      const snapshots =
        fulfilledCheckout.itemSnapshots ?? ledgerState.itemSnapshots;

      if (snapshots) {
        await persistCheckoutOrder({
          idempotencyKey,
          userId,
          checkoutDetails,
          itemSnapshots: snapshots,
          transaction: fulfilledCheckout.transaction,
        });
      }
    } catch (error: unknown) {
      console.error(
        "Sandbox checkout order persistence failed:",
        error instanceof Error ? error.message : "Unknown database error.",
      );
    }
  }

  return fulfilledCheckout;
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
