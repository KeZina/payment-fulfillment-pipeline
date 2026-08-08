import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { and, asc, desc, sql } from "drizzle-orm";
import { item } from "@/db/schemas";
import { decodeCursor } from "@/utils/server/decode-cursor";
import { encodeCursor } from "@/utils/server/encode-cursor";
import { itemsSearchParamsCache } from "@/schemas/items-search-params";
import {
  ITEMS_PAGINATION_LIMIT,
  ItemsFilterFields,
  SortOrder,
} from "@/constants";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : ITEMS_PAGINATION_LIMIT;

    const parsedQuery = Object.fromEntries(searchParams.entries());
    const parsedSearchParams = itemsSearchParamsCache.parse(parsedQuery);

    // Extract filtering parameters from the request
    const hasDiscountParam = searchParams.get(ItemsFilterFields.HasDiscount);
    const maxPriceParam = searchParams.get("maxPrice");
    const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : null;

    const conditions = [];

    if (parsedSearchParams.hasDiscount) {
      conditions.push(sql`${item.discount} > 0`);
    }
    if (maxPrice) {
      conditions.push(sql`${item.salePrice} <= ${maxPrice}`);
    }

    // Extract sorting parameters and cursor from the request
    const salePriceOrder = parsedSearchParams.salePrice;

    const cursor = decodeCursor(searchParams.get("cursor"));

    const isCursorUntouched =
      cursor &&
      cursor.fingerprint.salePrice === salePriceOrder &&
      cursor.fingerprint.maxPrice === maxPriceParam &&
      cursor.fingerprint.hasDiscount === hasDiscountParam;

    if (isCursorUntouched && cursor) {
      const isDescending = salePriceOrder === SortOrder.Desc;
      const cursorSalePrice = cursor.values.salePrice;
      const cursorId = cursor.values.id;

      conditions.push(
        isDescending
          ? sql`${item.salePrice} < ${cursorSalePrice} OR (${item.salePrice} = ${cursorSalePrice} AND ${item.id} > ${cursorId})`
          : sql`${item.salePrice} > ${cursorSalePrice} OR (${item.salePrice} = ${cursorSalePrice} AND ${item.id} > ${cursorId})`,
      );
    } else {
      console.log(
        "Sort parameter changed. Resetting cursor safely back to page 1",
      );
    }

    const orderBy = salePriceOrder
      ? [
          salePriceOrder === SortOrder.Desc
            ? desc(item.salePrice)
            : asc(item.salePrice),
          asc(item.id),
        ]
      : [desc(item.id)];

    const items = await db
      .select()
      .from(item)
      .where(!!conditions.length ? and(...conditions) : undefined)
      .orderBy(...orderBy)
      .limit(limit + 1);

    let nextCursor: string | null = null;

    if (items.length > limit) {
      const nextItem = items.pop();
      if (nextItem) {
        nextCursor = encodeCursor({
          fingerprint: {
            salePrice: salePriceOrder,
            maxPrice: maxPriceParam,
            hasDiscount: hasDiscountParam,
          },
          values: {
            salePrice: nextItem.salePrice,
            id: nextItem.id,
          },
        });
      }
    }

    return NextResponse.json({ data: items, nextCursor });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
