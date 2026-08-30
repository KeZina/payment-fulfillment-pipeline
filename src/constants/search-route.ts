import { adminItemsSearchParamsParsers } from "@/schemas/admin-items-search-params";
import type { SearchRouteConfig } from "@/types/search-route";

export enum SearchRouteBehavior {
  Hidden = "hidden",
  Instant = "instant",
  Debounced = "debounced",
  NonShallow = "non-shallow",
}

export const SEARCH_ROUTE_CONFIG: SearchRouteConfig[] = [
  {
    path: "/admin/items",
    behavior: SearchRouteBehavior.NonShallow,
    parsers: adminItemsSearchParamsParsers,
    resetValuesOnSearch: { page: 1 },
  },
  { path: "/user/basket", behavior: SearchRouteBehavior.Instant },
  { path: "/admin", behavior: SearchRouteBehavior.Hidden },
  { path: "/user/settings", behavior: SearchRouteBehavior.Hidden },
  { path: "/user/checkout", behavior: SearchRouteBehavior.Hidden },
  { path: "/user/history", behavior: SearchRouteBehavior.Hidden },
  { path: "/user/history/[orderId]", behavior: SearchRouteBehavior.Hidden },
];

// Every route not listed above (including "/") gets the debounced default
// behavior, so there is no need for an explicit "/" entry.
export const DEFAULT_SEARCH_ROUTE_CONFIG: SearchRouteConfig = {
  path: "__default__",
  behavior: SearchRouteBehavior.Debounced,
};
