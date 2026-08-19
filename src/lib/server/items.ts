import "server-only";

import {
  ITEMS_PAGINATION_LIMIT,
  SortOrder,
} from "@/constants";
import { db } from "@/db";
import { item } from "@/db/schemas";
import type { GetItemsPageParams, ItemsPage } from "@/types";
import { encodeCursor } from "@/utils/server/encode-cursor";
import { and, asc, desc, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export async function getItemsPage({
  search = null,
  salePrice = null,
  hasDiscount = false,
  inStockOnly = false,
  limit = ITEMS_PAGINATION_LIMIT,
  maxPrice = null,
  cursor = null,
}: GetItemsPageParams = {}): Promise<ItemsPage> {
  const conditions = [];

  if (search) {
    conditions.push(
      sql`(
        strpos(lower(${item.name}), lower(${search})) > 0
        OR strpos(lower(coalesce(${item.description}, '')), lower(${search})) > 0
      )`,
    );
  }

  if (hasDiscount) {
    conditions.push(sql`${item.discount} > 0`);
  }

  if (inStockOnly) {
    conditions.push(sql`${item.quantity} > 0`);
  }

  if (maxPrice !== null) {
    conditions.push(sql`${item.salePrice} <= ${maxPrice}`);
  }

  const isMatchingCursor =
    cursor?.fingerprint.search === search &&
    cursor.fingerprint.salePrice === salePrice &&
    cursor.fingerprint.maxPrice === maxPrice &&
    cursor.fingerprint.hasDiscount === hasDiscount &&
    cursor.fingerprint.inStockOnly === inStockOnly &&
    cursor.fingerprint.limit === limit;

  if (cursor && isMatchingCursor) {
    if (salePrice === SortOrder.Desc) {
      conditions.push(
        sql`${item.salePrice} < ${cursor.values.salePrice} OR (${item.salePrice} = ${cursor.values.salePrice} AND ${item.id} > ${cursor.values.id})`,
      );
    } else if (salePrice === SortOrder.Asc) {
      conditions.push(
        sql`${item.salePrice} > ${cursor.values.salePrice} OR (${item.salePrice} = ${cursor.values.salePrice} AND ${item.id} > ${cursor.values.id})`,
      );
    } else {
      conditions.push(sql`${item.id} < ${cursor.values.id}`);
    }
  }

  const orderBy = salePrice
    ? [
        salePrice === SortOrder.Desc
          ? desc(item.salePrice)
          : asc(item.salePrice),
        asc(item.id),
      ]
    : [desc(item.id)];

  const rows = await db
    .select({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      discount: item.discount,
      quantity: item.quantity,
      salePrice: item.salePrice,
    })
    .from(item)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(...orderBy)
    .limit(limit + 1);

  const hasNextPage = rows.length > limit;
  const data = hasNextPage ? rows.slice(0, limit) : rows;
  const lastItem = data.at(-1);

  const nextCursor =
    hasNextPage && lastItem
      ? encodeCursor({
          fingerprint: {
            search,
            salePrice,
            maxPrice,
            hasDiscount,
            inStockOnly,
            limit,
          },
          values: {
            salePrice: lastItem.salePrice,
            id: lastItem.id,
          },
        })
      : null;

  return { data, nextCursor };
}

export async function getCachedDefaultItemsPage() {
  "use cache";

  cacheLife({ stale: 30, revalidate: 60, expire: 300 });
  cacheTag("items");

  return getItemsPage();
}
