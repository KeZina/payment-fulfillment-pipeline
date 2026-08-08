import { SortOrder } from "@/constants";

export type CursorToken = {
  fingerprint: {
    salePrice: SortOrder | null;
    maxPrice: string | null;
    hasDiscount: string | null;
  };
  values: Record<string, any>;
};
