import { ITEMS_PAGINATION_LIMITS, SortOrder } from "@/constants";
import * as v from "valibot";

export const CursorTokenSchema = v.strictObject({
  fingerprint: v.strictObject({
    salePrice: v.nullable(v.enum(SortOrder)),
    maxPrice: v.nullable(v.pipe(v.number(), v.finite())),
    hasDiscount: v.boolean(),
    inStockOnly: v.boolean(),
    limit: v.picklist(ITEMS_PAGINATION_LIMITS),
  }),
  values: v.strictObject({
    salePrice: v.string(),
    id: v.pipe(v.number(), v.integer()),
  }),
});

export const parseCursorToken = v.safeParser(CursorTokenSchema);
