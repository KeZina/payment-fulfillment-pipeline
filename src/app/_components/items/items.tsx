"use client";

import { useInView } from "react-intersection-observer";
import { useItemsInfiniteFetch } from "@/hooks/use-items-infinite-fetch";
import type { Item } from "@/types";
import { ItemCard } from "../item-card";
import { ITEMS_PLACEHOLDER } from "@/constants/placeholders";
import { cn } from "@/lib";
import { itemsStyles } from "./items.styles";
import type { ItemsProps } from "./items.types";

export function Items({ emptyState, errorState }: ItemsProps) {
  const { ref, inView } = useInView();
  const { error, items, isLoading, isRefreshing } = useItemsInfiniteFetch({
    inView,
  });
  const hasError = Boolean(error) && items.length === 0;
  const isEmpty = !isLoading && !hasError && items.length === 0;
  const cards =
    isLoading && items.length === 0
      ? ITEMS_PLACEHOLDER.map((item: Item, index: number) => (
          <ItemCard key={`placeholder_${index}`} item={item} isPlaceholder />
        ))
      : items.map((item: Item, index: number) => (
          <ItemCard
            key={item.id}
            item={item}
            ref={index === items.length - 1 ? ref : undefined}
          />
        ));

  return (
    <div
      aria-busy={isLoading || isRefreshing}
      className={cn(
        itemsStyles.root,
        isRefreshing && "opacity-70",
      )}
    >
      {hasError ? errorState : isEmpty ? emptyState : cards}
    </div>
  );
}
