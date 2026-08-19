import { useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { UseItemsInfiniteFetchProps } from "./use-items-infinite-fetch.types";
import { useQueryStates } from "nuqs";
import { itemsSearchParamsParsers } from "@/schemas/items-search-params";
import type { ItemsPage } from "@/types";
import { createItemsGetKey } from "@/utils/items-request";

export const useItemsInfiniteFetch = ({
  inView,
}: UseItemsInfiniteFetchProps) => {
  const [{ salePrice, hasDiscount, inStockOnly, limit }] = useQueryStates(
    itemsSearchParamsParsers,
  );

  const getKey = createItemsGetKey({
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
      pages?.[pages.length - 1]?.nextCursor &&
      !isValidating
    ) {
      setSize((prevSize) => prevSize + 1);
    }
  }, [inView, isValidating, pages, setSize]);

  const fetchedItems = pages?.flatMap((page) => page.data) ?? [];
  const visibleItems = inStockOnly
    ? fetchedItems.filter((item) => item.quantity > 0)
    : fetchedItems;
  const isInitialLoading = isLoading && visibleItems.length === 0;

  return {
    error,
    isLoading: isInitialLoading,
    isRefreshing: isValidating && !isInitialLoading,
    items: visibleItems,
  };
};
