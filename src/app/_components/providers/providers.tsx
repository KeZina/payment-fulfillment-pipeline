import { GET_ITEMS_REQUEST } from "@/constants/requests/items";
import { buildItemsRequestParams } from "@/utils/items-request";
import { itemsSearchParamsCache } from "@/schemas/items-search-params";
import { SearchParams } from "nuqs/server";
import { SWRConfig } from "swr";
import { Suspense } from "react";

async function getItemsFallback(searchParams: SearchParams) {
  const parsedSearchParams = itemsSearchParamsCache.parse(searchParams);
  const params = buildItemsRequestParams({
    salePrice: parsedSearchParams.salePrice,
    hasDiscount: parsedSearchParams.hasDiscount,
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}${GET_ITEMS_REQUEST}?${new URLSearchParams(params).toString()}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }

  return response.json();
}

export async function Providers({
  children,
  searchParams,
}: {
  children: React.ReactNode;
  searchParams: SearchParams;
}) {
  const items = await getItemsFallback(searchParams);

  return (
    <SWRConfig
      value={{
        fallback: { GET_ITEMS_REQUEST: items },
      }}
    >
      {children}
    </SWRConfig>
  );
}
