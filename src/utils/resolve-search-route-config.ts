import {
  DEFAULT_SEARCH_ROUTE_CONFIG,
  SEARCH_ROUTE_CONFIG,
} from "@/constants/search-route";
import type { SearchRouteConfig } from "@/types/search-route";

// Matching requires an exact segment count, so e.g. "/admin" can never match
// "/admin/items" (or vice versa) regardless of where either entry sits in
// SEARCH_ROUTE_CONFIG — entry order in that array does not affect matching.
function matchesSearchRoutePath(configPath: string, pathname: string): boolean {
  if (configPath === pathname) {
    return true;
  }

  const configSegments = configPath.split("/").filter(Boolean);
  const pathnameSegments = pathname.split("/").filter(Boolean);

  if (configSegments.length !== pathnameSegments.length) {
    return false;
  }

  return configSegments.every((segment, index) => {
    if (segment.startsWith("[") && segment.endsWith("]")) {
      return pathnameSegments[index] !== undefined;
    }

    return segment === pathnameSegments[index];
  });
}

export function resolveSearchRouteConfig(pathname: string): SearchRouteConfig {
  const matchedRoute = SEARCH_ROUTE_CONFIG.find((entry) =>
    matchesSearchRoutePath(entry.path, pathname),
  );

  return matchedRoute ?? DEFAULT_SEARCH_ROUTE_CONFIG;
}
