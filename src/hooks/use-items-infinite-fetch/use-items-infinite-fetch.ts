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
  const [{ salePrice, hasDiscount, limit }] = useQueryStates(
    itemsSearchParamsParsers,
  );

  const getKey = createItemsGetKey({ salePrice, hasDiscount, limit });

  const {
    data: items,
    setSize,
    isValidating,
    isLoading,
  } = useSWRInfinite<ItemsPage>(getKey, {
    initialSize: 1,
    persistSize: false,
    revalidateIfStale: false,
  });

  useEffect(() => {
    if (
      inView &&
      items?.[items.length - 1]?.nextCursor &&
      !isValidating
    ) {
      setSize((prevSize) => prevSize + 1);
    }
  }, [inView, isValidating, items, setSize]);

  return {
    isLoading,
    items: items?.flatMap((page) => page.data) || [],
  };
};
