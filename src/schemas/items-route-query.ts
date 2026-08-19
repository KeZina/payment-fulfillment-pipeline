import "server-only";

import {
  ITEMS_PAGINATION_LIMIT,
  ITEMS_PAGINATION_LIMITS,
  SortOrder,
} from "@/constants";
import type { CursorToken } from "@/types";
import { decodeCursor } from "@/utils/server/decode-cursor";
import * as v from "valibot";

const BooleanQueryParamSchema = v.pipe(
  v.picklist(["true", "false"], "Value must be true or false"),
  v.transform((value) => value === "true"),
);

const PaginationLimitQueryParamSchema = v.pipe(
  v.string(),
  v.toNumber("Limit must be a number"),
  v.picklist(
    ITEMS_PAGINATION_LIMITS,
    `Limit must be one of ${ITEMS_PAGINATION_LIMITS.join(", ")}`,
  ),
);

const MaxPriceQueryParamSchema = v.pipe(
  v.string(),
  v.nonEmpty("Max price cannot be empty"),
  v.toNumber("Max price must be a number"),
  v.finite("Max price must be finite"),
  v.minValue(0, "Max price must be non-negative"),
);

const CursorQueryParamSchema = v.pipe(
  v.string(),
  v.nonEmpty("Cursor cannot be empty"),
  v.transform((token) => decodeCursor(token)),
  v.custom<CursorToken>((cursor) => cursor !== null, "Invalid cursor"),
);

export const ItemsRouteQuerySchema = v.pipe(
  v.strictObject({
    salePrice: v.optional(v.enum(SortOrder, "Invalid sale price order")),
    hasDiscount: v.optional(BooleanQueryParamSchema),
    inStockOnly: v.optional(BooleanQueryParamSchema),
    limit: v.optional(PaginationLimitQueryParamSchema),
    maxPrice: v.optional(MaxPriceQueryParamSchema),
    cursor: v.optional(CursorQueryParamSchema),
  }),
  v.transform((query) => ({
    salePrice: query.salePrice ?? null,
    hasDiscount: query.hasDiscount ?? false,
    inStockOnly: query.inStockOnly ?? false,
    limit: query.limit ?? ITEMS_PAGINATION_LIMIT,
    maxPrice: query.maxPrice ?? null,
    cursor: query.cursor ?? null,
  })),
);

export type ItemsRouteQuery = v.InferOutput<typeof ItemsRouteQuerySchema>;

export const parseItemsRouteQuery = v.safeParser(ItemsRouteQuerySchema);
