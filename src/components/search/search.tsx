"use client";

import type { ChangeEventHandler } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  ITEMS_SEARCH_MAX_LENGTH,
  SEARCH_URL_DEBOUNCE,
} from "@/constants";
import { itemsSearchParamsParsers } from "@/schemas/items-search-params";
import { Cancel01Icon, SearchIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQueryState } from "nuqs";
import { searchStyles } from "./search.styles";

export function Search() {
  const [search, setSearch] = useQueryState(
    "search",
    itemsSearchParamsParsers.search,
  );

  const updateSearch = (value: string | null) => {
    const nextSearch = value || null;

    setSearch(nextSearch, {
      history: "replace",
      limitUrlUpdates: SEARCH_URL_DEBOUNCE,
    });
  };

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    updateSearch(event.currentTarget.value);
  };

  const handleClearSearch = () => {
    updateSearch(null);
  };

  return (
    <InputGroup className={searchStyles.root} role='search'>
      <InputGroupInput
        aria-label='Search items'
        autoComplete='off'
        maxLength={ITEMS_SEARCH_MAX_LENGTH}
        onChange={handleSearchChange}
        placeholder='Search items...'
        type='search'
        value={search}
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
      {search && (
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
