"use client";

import { useInView } from "react-intersection-observer";
import { useItemsInfiniteFetch } from "@/hooks/use-items-infinite-fetch";
import { Item } from "@/types";
import { ItemCard } from "../item-card";
import { ITEMS_PLACEHOLDER } from "@/constants/placeholders";

export function Items() {
  const { ref, inView } = useInView();
  const { items, isLoading } = useItemsInfiniteFetch({ inView });
  const cards =
    isLoading && items.length === 0
      ? ITEMS_PLACEHOLDER.map((item: Item, index: number) => (
          <ItemCard key={`placeholder_${index}`} item={item} isPlaceholder />
        ))
      : items.map((item: Item) => <ItemCard key={item.id} item={item} />);

  return (
    <div className='m-auto flex h-64 w-[50%] flex-nowrap gap-4 overflow-x-auto px-12 py-4'>
      {cards}
      <div ref={ref} className='h-10' />
    </div>
  );
}
