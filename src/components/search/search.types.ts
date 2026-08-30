import type { SearchRouteBehavior } from "@/constants/search-route";
import type { SearchRouteConfig } from "@/types/search-route";

export type SearchProps = {
  routeConfig: Exclude<
    SearchRouteConfig,
    { behavior: SearchRouteBehavior.Hidden }
  >;
};
