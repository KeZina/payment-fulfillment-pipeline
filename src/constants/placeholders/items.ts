import { buildItemCategoryImageUrl } from "@/utils/item-category-image-url";
import type { CatalogItem } from "@/types";
import { ITEMS_PAGINATION_LIMIT } from "../pagination-limit";

export const ITEMS_PLACEHOLDER: Readonly<CatalogItem[]> = Array.from(
  { length: ITEMS_PAGINATION_LIMIT },
  (_, index) => ({
    id: index,
    name: "Loading...",
    description: "Loading...",
    categorySlug: "pizza",
    price: "0.00",
    discount: "0.00",
    quantity: 0,
    salePrice: "0.00",
    imageUrl: buildItemCategoryImageUrl("pizza"),
  }),
);
