import type { ItemsPaginationLimit, SortOrder } from "@/constants";
import type { CursorToken } from "../cursor-token";

export type GetItemsPageParams = {
  search?: string | null;
  salePrice?: SortOrder | null;
  hasDiscount?: boolean;
  inStockOnly?: boolean;
  limit?: ItemsPaginationLimit;
  maxPrice?: number | null;
  cursor?: CursorToken | null;
};
