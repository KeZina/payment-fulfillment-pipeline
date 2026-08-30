import "server-only";

import { buildItemCategoryImageUrl } from "@/utils/item-category-image-url";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { item } from "@/db/schemas";

export async function getItemsStockByIds(itemIds: number[]) {
  if (itemIds.length === 0) {
    return [];
  }

  const rows = await db
    .select({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      salePrice: item.salePrice,
      categorySlug: item.categorySlug,
    })
    .from(item)
    .where(inArray(item.id, itemIds));

  return rows.map((row) => ({
    ...row,
    imageUrl: buildItemCategoryImageUrl(row.categorySlug),
  }));
}
