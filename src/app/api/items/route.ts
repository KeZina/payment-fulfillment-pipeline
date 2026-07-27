import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sql, and } from "drizzle-orm";
import { item } from "@/db/schemas";
import { decodeCursor } from "@/utils/server/decode-cursor";
import { encodeCursor } from "@/utils/server/encode-cursor";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");

    // Extract filtering parameters from the request
    const hasDiscountParam = searchParams.get("hasDiscount");
    const hasDiscount = hasDiscountParam === "true";
    const maxPriceParam = searchParams.get("maxPrice");
    const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : null;

    const conditions = [];

    if (hasDiscount) {
      conditions.push(sql`${item.discount} > 0`);
    }
    if (maxPrice) {
      conditions.push(sql`${item.salePrice} <= ${maxPrice}`);
    }

    // Extract sorting parameters and cursor from the request
    const sortByParam = searchParams.get("sortBy");
    const sortBy = (sortByParam ? sortByParam.split(",") : []) as (
      | "salePrice"
      | "price"
      | "id"
    )[];

    if (!sortBy.includes("id")) sortBy.push("id"); // Ensure 'id' is always included for consistent ordering

    const cursor = decodeCursor(searchParams.get("cursor"));

    const isCursorUntouched =
      cursor &&
      cursor.fingerprint.sortBy === sortByParam &&
      cursor.fingerprint.maxPrice === maxPriceParam &&
      cursor.fingerprint.hasDiscount === hasDiscountParam;

    if (isCursorUntouched) {
      const columnIdentifiers = sortBy.map((field) => item[field]);
      const bindingValues = sortBy.map((field) => cursor.values[field]);

      conditions.push(sql`(${columnIdentifiers}) < (${bindingValues}  )`);
    } else {
      console.log(
        "Sort parameter changed. Resetting cursor safely back to page 1",
      );
    }

    const orderBy = sortBy.map((field) => sql`${item[field]} DESC`);

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
        const nextValues: Record<string, any> = {};
        sortBy.forEach((field) => {
          nextValues[field] = nextItem[field];
        });

        nextCursor = encodeCursor({
          fingerprint: {
            sortBy: sortByParam,
            maxPrice: maxPriceParam,
            hasDiscount: hasDiscountParam,
          },
          values: nextValues,
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
