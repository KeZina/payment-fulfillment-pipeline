import type { ItemsPaginationLimit, SortOrder } from "@/constants";

export type ItemsRequestQuery = {
  salePrice: SortOrder | null;
  hasDiscount: boolean;
  limit: ItemsPaginationLimit;
};
