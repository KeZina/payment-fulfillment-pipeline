import { ITEMS_PAGINATION_LIMIT } from "../pagination-limit";
import type { ItemsRequestQuery } from "@/types";

export const GET_ITEMS_REQUEST = "/api/items";

export const DEFAULT_ITEMS_REQUEST_QUERY: ItemsRequestQuery = {
  search: "",
  salePrice: null,
  hasDiscount: false,
  inStockOnly: false,
  limit: ITEMS_PAGINATION_LIMIT,
};
