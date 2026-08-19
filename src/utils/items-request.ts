import { ITEMS_PAGINATION_LIMIT } from "@/constants";
import type { ItemsPaginationLimit } from "@/constants";
import { GET_ITEMS_REQUEST } from "@/constants/requests";
import type { ItemsPage, ItemsRequestQuery } from "@/types";

export function buildItemsRequestParams({
  search,
  salePrice,
  hasDiscount,
  inStockOnly,
  cursor,
  limit = ITEMS_PAGINATION_LIMIT,
}: {
  search?: string | null;
  salePrice?: string | null;
  hasDiscount?: boolean | null;
  inStockOnly?: boolean | null;
  cursor?: string | null;
  limit?: ItemsPaginationLimit;
}): Record<string, string> {
  const params: Record<string, string> = {
    limit: limit.toString(),
  };

  const normalizedSearch = search?.trim();

  if (normalizedSearch) {
    params.search = normalizedSearch;
  }

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
