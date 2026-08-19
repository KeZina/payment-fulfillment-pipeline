import { ITEMS_PAGINATION_LIMIT } from "@/constants";
import type { ItemsPaginationLimit } from "@/constants";
import { GET_ITEMS_REQUEST } from "@/constants/requests";
import type { ItemsPage, ItemsRequestQuery } from "@/types";

export const DEFAULT_ITEMS_REQUEST_QUERY: ItemsRequestQuery = {
  salePrice: null,
  hasDiscount: false,
  inStockOnly: false,
  limit: ITEMS_PAGINATION_LIMIT,
};

export function buildItemsRequestParams({
  salePrice,
  hasDiscount,
  inStockOnly,
  cursor,
  limit = ITEMS_PAGINATION_LIMIT,
}: {
  salePrice?: string | null;
  hasDiscount?: boolean | null;
  inStockOnly?: boolean | null;
  cursor?: string | null;
  limit?: ItemsPaginationLimit;
}): Record<string, string> {
  const params: Record<string, string> = {
    limit: limit.toString(),
  };

  if (salePrice) {
    params.salePrice = salePrice;
  }

  if (hasDiscount) {
    params.hasDiscount = "true";
  }

  if (inStockOnly) {
    params.inStockOnly = "true";
  }

  if (cursor) {
    params.cursor = cursor;
  }

  return params;
}

export function createItemsGetKey(query: ItemsRequestQuery) {
  return (pageIndex: number, previousPageData: ItemsPage | null) => {
    if (previousPageData?.nextCursor === null) {
      return null;
    }

    const params = buildItemsRequestParams({
      ...query,
      cursor:
        pageIndex > 0 ? (previousPageData?.nextCursor ?? undefined) : undefined,
    });

    return `${GET_ITEMS_REQUEST}?${new URLSearchParams(params).toString()}`;
  };
}
