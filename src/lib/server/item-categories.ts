import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { itemCategory } from "@/db/schemas";

export async function getItemCategoryImage(categorySlug: string) {
  const [category] = await db
    .select({
      contentType: itemCategory.contentType,
      imageData: itemCategory.imageData,
    })
    .from(itemCategory)
    .where(eq(itemCategory.slug, categorySlug))
    .limit(1);

  if (!category) {
    return null;
  }

  return {
    contentType: category.contentType,
    buffer: Buffer.from(category.imageData, "base64"),
  };
}
