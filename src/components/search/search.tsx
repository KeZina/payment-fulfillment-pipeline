"use client";

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

export function Search() {
  const [search, setSearch] = useQueryState(
    "search",
    itemsSearchParamsParsers.search,
  );

  const updateSearch = (value: string | null) => {
    setSearch(value || null, {
      history: "replace",
      limitUrlUpdates: SEARCH_URL_DEBOUNCE,
    });
  };

  return (
    <InputGroup className='w-full max-w-xl' role='search'>
      <InputGroupInput
        aria-label='Search menu items'
        autoComplete='off'
        maxLength={ITEMS_SEARCH_MAX_LENGTH}
        onChange={(event) => updateSearch(event.currentTarget.value)}
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
            onClick={() => updateSearch(null)}
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
