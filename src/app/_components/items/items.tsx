"use client";

import { useInView } from "react-intersection-observer";
import { Spinner } from "@/components/ui/spinner";
import { useItemsInfiniteFetch } from "@/hooks/use-items-infinite-fetch";
import type { CatalogItem } from "@/types";
import { ItemCard } from "../item-card";
import { ITEMS_PLACEHOLDER } from "@/constants/placeholders";
import { cn } from "@/lib";
import { itemsStyles } from "./items.styles";
import type { ItemsProps } from "./items.types";

export function Items({ emptyState, errorState }: ItemsProps) {
  const { ref, inView } = useInView();
  const { error, hasMore, items, isLoading, isLoadingMore, isRefreshing } =
    useItemsInfiniteFetch({
      inView,
    });
  const hasError = Boolean(error) && items.length === 0;
  const isEmpty = !isLoading && !hasError && items.length === 0;
  const cards =
    isLoading && items.length === 0
      ? ITEMS_PLACEHOLDER.map((item: CatalogItem, index: number) => (
          <ItemCard key={`placeholder_${index}`} item={item} isPlaceholder />
        ))
      : items.map((item: CatalogItem) => (
          <ItemCard key={item.id} item={item} />
        ));

  return (
    <div
      aria-busy={isLoading || isLoadingMore || isRefreshing}
      className={cn(
        itemsStyles.root,
        isRefreshing && !isLoadingMore && "opacity-70",
      )}
    >
      {hasError ? errorState : isEmpty ? emptyState : cards}
      {isLoadingMore ? (
        <div className={itemsStyles.loader} role='status' aria-live='polite'>
          <Spinner className='size-5' aria-hidden='true' />
          <span>Loading more items…</span>
        </div>
      ) : null}
      {!isLoading && !isEmpty && hasMore ? (
        <div ref={ref} className={itemsStyles.sentinel} aria-hidden='true' />
      ) : null}
    </div>
  );
}
