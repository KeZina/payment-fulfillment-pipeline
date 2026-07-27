import { api } from "@/lib/client";
import { useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { UseItemsInfiniteFetchProps } from "./use-items-infinite-fetch.types";
import { Item } from "@/types/item";
import { AxiosResponse } from "axios";
import { WithCursor } from "@/types/with-cursor";

export const useItemsInfiniteFetch = ({
  inView,
}: UseItemsInfiniteFetchProps) => {
  const getKey = (
    pageIndex: number,
    previousPageData: AxiosResponse<WithCursor<Item>> | null,
  ) => {
    if (previousPageData && previousPageData.data.nextCursor === null)
      return null;

    const params: Record<string, string | string[]> = {
      limit: "10",
    };

    if (pageIndex > 0 && previousPageData?.data.nextCursor) {
      params.cursor = previousPageData.data.nextCursor;
    }

    params.sortBy = "salePrice,price";

    return { url: "/api/items", params };
  };

  const {
    data: items,
    setSize,
    isValidating,
  } = useSWRInfinite<AxiosResponse<WithCursor<Item>>>(
    getKey,
    ({ url, params }) => api.get(url, { params }),
    {
      initialSize: 1,
    },
  );

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
    items: items?.flatMap((page) => page.data.data) || [],
  };
};
