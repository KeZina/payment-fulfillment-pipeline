import { useDeferredValue, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { UseItemsInfiniteFetchProps } from "./use-items-infinite-fetch.types";
import { useQueryStates } from "nuqs";
import { itemsSearchParamsParsers } from "@/schemas/items-search-params";
import type { ItemsPage } from "@/types";
import { createItemsGetKey } from "@/utils/items-request";

export const useItemsInfiniteFetch = ({
  inView,
}: UseItemsInfiniteFetchProps) => {
  const [{ search, salePrice, hasDiscount, inStockOnly, limit }] =
    useQueryStates(itemsSearchParamsParsers);

  // The search query state is already debounced at the source (see the
  // Search component), so this only needs to defer re-renders for a smooth
  // transition when the value changes.
  const normalizedSearch = search.trim();
  const deferredSearch = useDeferredValue(normalizedSearch);
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
  const lastPage = pages?.[pages.length - 1];
  const hasMore = Boolean(lastPage?.nextCursor);
  const isInitialLoading = isLoading && visibleItems.length === 0;
  const isLoadingMore =
    isValidating &&
    visibleItems.length > 0 &&
    hasMore &&
    !isWaitingForSearch;

  return {
    error,
    hasMore,
    isLoading: isInitialLoading,
    isLoadingMore,
    isRefreshing:
      (isWaitingForSearch || isValidating) && !isInitialLoading,
    items: visibleItems,
  };
};
