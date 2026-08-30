import type { SingleParserBuilder } from "nuqs";
import type { SearchRouteBehavior } from "@/constants/search-route";

export type SearchRouteMatch = {
  path: string;
};

/**
 * The only shape the `Search` component actually needs from a non-shallow
 * route's parser map: a `search` key with a non-nullable string default.
 * Route-specific parsers (e.g. admin's `page`/`limit`) can still be passed
 * through `parsers` at the config site without this file needing to know
 * about them.
 */
export type SearchQueryParsers = {
  search: SingleParserBuilder<string> & { defaultValue: string };
};

export type SearchRouteBehaviorConfig =
  | { behavior: SearchRouteBehavior.Hidden }
  | { behavior: SearchRouteBehavior.Instant }
  | { behavior: SearchRouteBehavior.Debounced }
  | {
      behavior: SearchRouteBehavior.NonShallow;
      parsers: SearchQueryParsers;
      resetValuesOnSearch?: Record<string, unknown>;
    };

export type SearchRouteConfig = SearchRouteMatch & SearchRouteBehaviorConfig;
