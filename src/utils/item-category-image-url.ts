import { ITEM_CATEGORY_IMAGE_ROUTE_PREFIX } from "@/constants/item-category";

export function buildItemCategoryImageUrl(categorySlug: string) {
  return `${ITEM_CATEGORY_IMAGE_ROUTE_PREFIX}/${categorySlug}/image`;
}
