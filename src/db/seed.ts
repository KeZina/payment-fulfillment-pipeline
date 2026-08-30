"use server";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { sql } from "drizzle-orm";
import { db } from "./index";
import { item, itemCategory } from "./schemas";
import {
  CATEGORY_DEFINITIONS,
  OUT_OF_STOCK_ITEM_NAMES,
  TARGET_ITEM_COUNT,
  buildCatalogEntry,
  buildDiscount,
} from "./seed-data/catalog";

type ItemInsert = typeof item.$inferInsert;

const SEED_IMAGE_DIR = join(process.cwd(), "src/db/seed-data/category-images");

function loadCategoryImage(fileName: string) {
  const buffer = readFileSync(join(SEED_IMAGE_DIR, fileName));

  return {
    contentType: "image/png",
    imageData: buffer.toString("base64"),
  };
}

const categoryRows = CATEGORY_DEFINITIONS.map(({ slug, label, fileName }) => ({
  slug,
  label,
  ...loadCategoryImage(fileName),
}));

const items: ItemInsert[] = Array.from({ length: TARGET_ITEM_COUNT }, (_, index) => {
  const entry = buildCatalogEntry(index);

  return {
    name: entry.name,
    description: entry.description,
    price: entry.price,
    categorySlug: entry.categorySlug,
    ...(buildDiscount(index) ? { discount: buildDiscount(index) } : {}),
    quantity: OUT_OF_STOCK_ITEM_NAMES.has(entry.name)
      ? 0
      : ((index * 7) % 20) + 1,
  };
});

async function seed() {
  await db.delete(item);

  await db
    .insert(itemCategory)
    .values(categoryRows)
    .onConflictDoUpdate({
      target: itemCategory.slug,
      set: {
        label: sql`excluded.label`,
        contentType: sql`excluded.content_type`,
        imageData: sql`excluded.image_data`,
      },
    });

  await db.insert(item).values(items).onConflictDoNothing();
  console.log(
    `Seeded ${categoryRows.length} category images and ${items.length} items.`,
  );
  process.exit(0);
}

seed().catch((error) => {
  console.error("Failed to seed items:", error);
  process.exitCode = 1;
});
