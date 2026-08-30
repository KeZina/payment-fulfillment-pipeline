import {
  createSearchParamsCache,
  inferParserType,
  parseAsInteger,
} from "nuqs/server";
import { ADMIN_ITEMS_SEARCH_PARAM_OPTIONS } from "@/constants/admin";
import { itemsSearchParamsParsers } from "./items-search-params";

export const adminItemsSearchParamsParsers = {
  search: itemsSearchParamsParsers.search.withOptions(
    ADMIN_ITEMS_SEARCH_PARAM_OPTIONS,
  ),
  limit: itemsSearchParamsParsers.limit.withOptions(
    ADMIN_ITEMS_SEARCH_PARAM_OPTIONS,
  ),
  page: parseAsInteger
    .withDefault(1)
    .withOptions(ADMIN_ITEMS_SEARCH_PARAM_OPTIONS),
} as const;

export type AdminItemsSearchParams = inferParserType<
  typeof adminItemsSearchParamsParsers
>;

export const adminItemsSearchParamsCache = createSearchParamsCache(
  adminItemsSearchParamsParsers,
);
