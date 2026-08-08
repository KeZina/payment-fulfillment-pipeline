import { createSearchParamsCache, inferParserType, parseAsBoolean, parseAsStringLiteral } from "nuqs/server";
import { SortOrder } from "@/constants";

const salePriceValues = [SortOrder.Asc, SortOrder.Desc] as const;

export const itemsSearchParamsParsers = {
  salePrice: parseAsStringLiteral(salePriceValues),
  hasDiscount: parseAsBoolean.withDefault(false),
} as const;

export type ItemsSearchParams = inferParserType<typeof itemsSearchParamsParsers>;

export const itemsSearchParamsCache = createSearchParamsCache(itemsSearchParamsParsers);
