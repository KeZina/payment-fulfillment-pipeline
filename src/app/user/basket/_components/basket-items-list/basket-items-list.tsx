"use client";

import { useQueryState } from "nuqs";
import { ItemGroup } from "@/components/ui/item";
import { itemsSearchParamsParsers } from "@/schemas/items-search-params";
import { useBasketStore } from "@/stores/basket-store";
import { BasketItemCard } from "../basket-item-card";
import { basketItemsListStyles } from "./basket-items-list.styles";
import type { BasketItemsListProps } from "./basket-items-list.types";

export function BasketItemsList({ emptyState }: BasketItemsListProps) {
  const [search] = useQueryState(
    "search",
    itemsSearchParamsParsers.search,
  );
  const { items } = useBasketStore();
  const normalizedSearch = search.trim().toLowerCase();
  const filteredItems = normalizedSearch
    ? items.filter((item) =>
        item.name.toLowerCase().includes(normalizedSearch),
      )
    : items;

  if (filteredItems.length === 0) {
    return emptyState;
  }

  return (
    <ItemGroup className={basketItemsListStyles.root}>
      {filteredItems.map((item) => (
        <BasketItemCard key={item.id} item={item} />
      ))}
    </ItemGroup>
  );
}
