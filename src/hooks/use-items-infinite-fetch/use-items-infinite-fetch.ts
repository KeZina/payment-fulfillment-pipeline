import { useDeferredValue, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { UseItemsInfiniteFetchProps } from "./use-items-infinite-fetch.types";
import { useQueryStates } from "nuqs";
import { useDebounce } from "use-debounce";
import { SEARCH_DEBOUNCE_MS } from "@/constants";
import { itemsSearchParamsParsers } from "@/schemas/items-search-params";
import type { ItemsPage } from "@/types";
import { createItemsGetKey } from "@/utils/items-request";

export const useItemsInfiniteFetch = ({
  inView,
}: UseItemsInfiniteFetchProps) => {
  const [{ search, salePrice, hasDiscount, inStockOnly, limit }] =
    useQueryStates(itemsSearchParamsParsers);

  const normalizedSearch = search.trim();
  const [debouncedSearch] = useDebounce(
    normalizedSearch,
    SEARCH_DEBOUNCE_MS,
  );
  const deferredSearch = useDeferredValue(debouncedSearch);
  const isWaitingForSearch = normalizedSearch !== deferredSearch;

  const getKey = createItemsGetKey({
    search: deferredSearch,
    salePrice,
    hasDiscount,
    inStockOnly,
    limit,
  });

  const {
    data: pages,
    error,
    setSize,
    isValidating,
    isLoading,
  } = useSWRInfinite<ItemsPage>(getKey, {
    initialSize: 1,
    keepPreviousData: true,
    persistSize: false,
  });

  useEffect(() => {
    if (
      inView &&
      !isWaitingForSearch &&
      pages?.[pages.length - 1]?.nextCursor &&
      !isValidating
    ) {
      setSize((prevSize) => prevSize + 1);
    }
  }, [inView, isValidating, isWaitingForSearch, pages, setSize]);

  const fetchedItems = pages?.flatMap((page) => page.data) ?? [];
  const visibleItems = inStockOnly
    ? fetchedItems.filter((item) => item.quantity > 0)
    : fetchedItems;
  const isInitialLoading = isLoading && visibleItems.length === 0;

  return {
    error,
    isLoading: isInitialLoading,
    isRefreshing:
      (isWaitingForSearch || isValidating) && !isInitialLoading,
    items: visibleItems,
  };
};
