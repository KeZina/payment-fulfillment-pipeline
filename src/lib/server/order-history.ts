import "server-only";

import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { order, orderLineItem } from "@/db/schemas";

export async function getUserOrderHistory(userId: string) {
  return db
    .select({
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount,
      currency: order.currency,
      createdAt: order.createdAt,
      lineItemCount: count(orderLineItem.id),
    })
    .from(order)
    .leftJoin(orderLineItem, eq(orderLineItem.orderId, order.id))
    .where(eq(order.userId, userId))
    .groupBy(order.id)
    .orderBy(desc(order.createdAt));
}

export async function getUserOrderById(userId: string, orderId: string) {
  const [orderRow] = await db
    .select()
    .from(order)
    .where(and(eq(order.id, orderId), eq(order.userId, userId)))
    .limit(1);

  if (!orderRow) {
    return null;
  }

  const lineItems = await db
    .select()
    .from(orderLineItem)
    .where(eq(orderLineItem.orderId, orderId))
    .orderBy(orderLineItem.itemName);

  return {
    ...orderRow,
    lineItems,
  };
}
