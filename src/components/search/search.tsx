"use client";

import { useMemo, useState, type ChangeEventHandler } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ITEMS_SEARCH_MAX_LENGTH, SEARCH_DEBOUNCE_MS } from "@/constants";
import { SearchRouteBehavior } from "@/constants/search-route";
import { itemsSearchParamsParsers } from "@/schemas/items-search-params";
import { Cancel01Icon, SearchIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQueryStates } from "nuqs";
import { searchStyles } from "./search.styles";
import type { SearchProps } from "./search.types";

// The Nav resolves the route config once (see NavSearch) and only mounts
// this component for non-hidden routes, so no "hidden" branch is needed
// here.
export function Search({ routeConfig }: SearchProps) {
  const isNonShallow = routeConfig.behavior === SearchRouteBehavior.NonShallow;
  const parsers = useMemo(
    () =>
      isNonShallow
        ? routeConfig.parsers
        : { search: itemsSearchParamsParsers.search },
    [isNonShallow, routeConfig],
  );

  const [{ search }, setQueryState] = useQueryStates(parsers);

  // The query state only updates after the debounce settles, so we keep the
  // input's own value in local state to stay responsive on every keystroke.
  // Synced during render (rather than an effect) so external changes to
  // `search` (e.g. the clear filters button) are reflected immediately.
  const [inputValue, setInputValue] = useState(search);
  const [syncedSearch, setSyncedSearch] = useState(search);

  if (search !== syncedSearch) {
    setSyncedSearch(search);
    setInputValue(search);
  }

  const updateSearch = (value: string | null) => {
    const nextSearch = value || null;

    setQueryState(
      {
        search: nextSearch,
        ...(isNonShallow ? routeConfig.resetValuesOnSearch : undefined),
      },
      { history: "replace" },
    );
  };

  const debouncedUpdateSearch = useDebouncedCallback(
    updateSearch,
    SEARCH_DEBOUNCE_MS,
  );

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.currentTarget;

    setInputValue(value);

    if (routeConfig.behavior === SearchRouteBehavior.Instant) {
      updateSearch(value);
    } else {
      debouncedUpdateSearch(value);
    }
  };

  const handleClearSearch = () => {
    debouncedUpdateSearch.cancel();
    setInputValue("");
    updateSearch(null);
  };

  return (
    <InputGroup className={searchStyles.root} role='search'>
      <InputGroupInput
        aria-label='Search items'
        autoComplete='off'
        className={searchStyles.input}
        maxLength={ITEMS_SEARCH_MAX_LENGTH}
        onChange={handleSearchChange}
        placeholder='Search items...'
        type='search'
        value={inputValue}
      />
      <InputGroupAddon>
        <HugeiconsIcon
          aria-hidden='true'
          icon={SearchIcon}
          size={24}
          color='currentColor'
          strokeWidth={1.5}
        />
      </InputGroupAddon>
      {inputValue && (
        <InputGroupAddon align='inline-end'>
          <InputGroupButton
            aria-label='Clear search'
            onClick={handleClearSearch}
            size='icon-xs'
          >
            <HugeiconsIcon
              aria-hidden='true'
              icon={Cancel01Icon}
              size={16}
              strokeWidth={1.5}
            />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
