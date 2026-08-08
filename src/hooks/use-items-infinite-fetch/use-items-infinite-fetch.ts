import { api } from "@/lib/client";
import { useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { UseItemsInfiniteFetchProps } from "./use-items-infinite-fetch.types";
import { Item } from "@/types/item";
import { AxiosResponse } from "axios";
import { WithCursor } from "@/types/with-cursor";
import { SortOrder } from "@/constants";
import { parseAsBoolean, parseAsStringLiteral, useQueryStates } from "nuqs";
import { GET_ITEMS_REQUEST } from "@/constants/requests";
import { buildItemsRequestParams } from "@/utils/items-request";

export const useItemsInfiniteFetch = ({
  inView,
}: UseItemsInfiniteFetchProps) => {
  const [{ salePrice, hasDiscount }] = useQueryStates({
    salePrice: parseAsStringLiteral(Object.values(SortOrder)),
    hasDiscount: parseAsBoolean.withDefault(false),
  });

  const getKey = (
    pageIndex: number,
    previousPageData: AxiosResponse<WithCursor<Item>> | null,
  ) => {
    if (previousPageData && previousPageData.data.nextCursor === null)
      return null;

    const params = buildItemsRequestParams({
      salePrice,
      hasDiscount,
      cursor:
        pageIndex > 0 && previousPageData?.data.nextCursor
          ? previousPageData.data.nextCursor
          : undefined,
    });

    return { url: GET_ITEMS_REQUEST, params };
  };

  const {
    data: items,
    setSize,
    isValidating,
    isLoading,
  } = useSWRInfinite<AxiosResponse<WithCursor<Item>>>(
    getKey,
    ({ url, params }) => api.get(url, { params }),
    {
      initialSize: 1,
    },
  );
  console.log(items);
  useEffect(() => {
    if (
      inView &&
      items?.[items.length - 1]?.data?.nextCursor &&
      !isValidating
    ) {
      setSize((prevSize) => prevSize + 1);
    }
  }, [inView, isValidating, items, setSize]);

  return {
    isLoading,
    items: items?.flatMap((page) => page.data.data) || [],
  };
};
