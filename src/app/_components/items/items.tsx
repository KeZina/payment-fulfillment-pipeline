// components/ItemFeed.tsx
"use client";

import { useInView } from "react-intersection-observer";
import { useItemsInfiniteFetch } from "@/hooks/use-items-infinite-fetch";
import { Item } from "@/types";

export function Items() {
  const { ref, inView } = useInView();
  const { items } = useItemsInfiniteFetch({ inView });

  return (
    <div className='flex overflow-x-auto py-4 px-12 w-[50%] h-64'>
      {items.map((item: Item) => (
        <div key={item.id} className='p-4 border'>
          <h3>{item.name}</h3>
          <p className='text-emerald-600 font-bold'>
            ${Number(item.salePrice).toFixed(2)}
          </p>
        </div>
      ))}
      <div ref={ref} className='h-10 col-span-full' />
    </div>
  );
}
