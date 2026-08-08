import { ITEMS_PAGINATION_LIMIT } from "@/constants";

export function buildItemsRequestParams({
  salePrice,
  hasDiscount,
  cursor,
  limit = ITEMS_PAGINATION_LIMIT,
}: {
  salePrice?: string | null;
  hasDiscount?: boolean | null;
  cursor?: string | null;
  limit?: number;
}): Record<string, string> {
  const params: Record<string, string> = {
    limit: limit.toString(),
  };

  if (salePrice) {
    params.salePrice = salePrice;
  }

  if (typeof hasDiscount === "boolean") {
    params.hasDiscount = hasDiscount.toString();
  }

  if (cursor) {
    params.cursor = cursor;
  }

  return params;
}
