import type { ItemsPaginationLimit, SortOrder } from "@/constants";

export type ItemsRequestQuery = {
  search: string;
  salePrice: SortOrder | null;
  hasDiscount: boolean;
  inStockOnly: boolean;
  limit: ItemsPaginationLimit;
};
