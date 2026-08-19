import {
  createSearchParamsCache,
  inferParserType,
  parseAsBoolean,
  parseAsNumberLiteral,
  parseAsStringLiteral,
} from "nuqs/server";
import {
  ITEMS_PAGINATION_LIMIT,
  ITEMS_PAGINATION_LIMITS,
  SortOrder,
} from "@/constants";

const salePriceValues = [SortOrder.Asc, SortOrder.Desc] as const;

export const itemsSearchParamsParsers = {
  salePrice: parseAsStringLiteral(salePriceValues),
  hasDiscount: parseAsBoolean.withDefault(false),
  inStockOnly: parseAsBoolean.withDefault(false),
  limit: parseAsNumberLiteral(ITEMS_PAGINATION_LIMITS).withDefault(
    ITEMS_PAGINATION_LIMIT,
  ),
} as const;

export type ItemsSearchParams = inferParserType<typeof itemsSearchParamsParsers>;

export const itemsSearchParamsCache = createSearchParamsCache(itemsSearchParamsParsers);
