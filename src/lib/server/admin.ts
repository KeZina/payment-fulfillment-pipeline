import "server-only";

import { and, count, desc, eq, sql } from "drizzle-orm";
import { ITEMS_PAGINATION_LIMIT } from "@/constants";
import { db } from "@/db";
import { item, order, user } from "@/db/schemas";
import type {
  AdminItemsPage,
  GetAdminItemsPageParams,
} from "@/types";
import { buildItemTextSearchCondition } from "./item-search-condition";

export async function getAdminOrderStats() {
  const [stats] = await db
    .select({
      orderCount: count(order.id),
      revenue: sql<string>`coalesce(sum(${order.totalAmount}), 0)::numeric(10, 2)`,
    })
    .from(order);

  return {
    orderCount: Number(stats?.orderCount ?? 0),
    revenue: stats?.revenue ?? "0.00",
  };
}

export async function getAdminRecentOrders(limit = 10) {
  return db
    .select({
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      recipientName: order.recipientName,
      userEmail: user.email,
      userName: user.name,
    })
    .from(order)
    .innerJoin(user, eq(order.userId, user.id))
    .orderBy(desc(order.createdAt))
    .limit(limit);
}

export async function getAdminItemsPage({
  search = null,
  page = 1,
  limit = ITEMS_PAGINATION_LIMIT,
}: GetAdminItemsPageParams = {}): Promise<AdminItemsPage> {
  const conditions = [];
  const normalizedSearch = search?.trim() ?? "";

  if (normalizedSearch) {
    conditions.push(buildItemTextSearchCondition(normalizedSearch));
  }

  const whereClause = conditions.length ? and(...conditions) : undefined;

  const [countResult] = await db
    .select({ total: count(item.id) })
    .from(item)
    .where(whereClause);

  const total = Number(countResult?.total ?? 0);
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  const safePage =
    totalPages === 0 ? 1 : Math.min(Math.max(1, page), totalPages);
  const offset = (safePage - 1) * limit;

  const data = await db
    .select({
      id: item.id,
      name: item.name,
      price: item.price,
      discount: item.discount,
      quantity: item.quantity,
      salePrice: item.salePrice,
    })
    .from(item)
    .where(whereClause)
    .orderBy(item.id)
    .limit(limit)
    .offset(offset);

  return {
    data,
    page: safePage,
    limit,
    total,
    totalPages,
  };
}
