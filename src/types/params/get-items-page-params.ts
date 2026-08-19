import type { ItemsPaginationLimit, SortOrder } from "@/constants";
import type { CursorToken } from "../cursor-token";

export type GetItemsPageParams = {
  salePrice?: SortOrder | null;
  hasDiscount?: boolean;
  limit?: ItemsPaginationLimit;
  maxPrice?: number | null;
  cursor?: CursorToken | null;
};
