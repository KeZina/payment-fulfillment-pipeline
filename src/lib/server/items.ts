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
  salePrice = null,
  hasDiscount = false,
  limit = ITEMS_PAGINATION_LIMIT,
  maxPrice = null,
  cursor = null,
}: GetItemsPageParams = {}): Promise<ItemsPage> {
  const conditions = [];

  if (hasDiscount) {
    conditions.push(sql`${item.discount} > 0`);
  }

  if (maxPrice !== null) {
    conditions.push(sql`${item.salePrice} <= ${maxPrice}`);
  }

  const isMatchingCursor =
    cursor?.fingerprint.salePrice === salePrice &&
    cursor.fingerprint.maxPrice === maxPrice &&
    cursor.fingerprint.hasDiscount === hasDiscount &&
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
    .select()
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
            salePrice,
            maxPrice,
            hasDiscount,
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
