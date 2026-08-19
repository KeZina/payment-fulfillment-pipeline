"use client";

import { useInView } from "react-intersection-observer";
import { useItemsInfiniteFetch } from "@/hooks/use-items-infinite-fetch";
import { Item } from "@/types";
import { ItemCard } from "../item-card";
import { ITEMS_PLACEHOLDER } from "@/constants/placeholders";
import { cn } from "@/lib";

export function Items() {
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
      : items.map((item: Item) => <ItemCard key={item.id} item={item} />);

  return (
    <div
      aria-busy={isLoading || isRefreshing}
      className={cn(
        "relative mx-auto flex h-64 w-full max-w-4xl flex-nowrap gap-4 overflow-x-auto px-4 py-4 sm:px-6",
        isRefreshing && "opacity-70",
      )}
    >
      {hasError ? (
        <div
          className='flex h-full w-full flex-col items-center justify-center rounded-xl border border-dashed border-rose-200 bg-rose-50 px-6 text-center'
          role='alert'
        >
          <p className='font-semibold text-rose-800'>Unable to load items</p>
          <p className='mt-1 text-sm text-rose-600'>
            Please try changing the filter again.
          </p>
        </div>
      ) : isEmpty ? (
        <div
          className='flex h-full w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center'
          role='status'
        >
          <p className='font-semibold text-slate-700'>No items found</p>
          <p className='mt-1 text-sm text-slate-500'>
            There are no items matching the selected filters.
          </p>
        </div>
      ) : (
        <>
          {cards}
          <div ref={ref} className='h-10' />
          {isRefreshing && (
            <span className='sticky right-2 top-2 self-start rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-white shadow-sm'>
              Updating…
            </span>
          )}
        </>
      )}
    </div>
  );
}
