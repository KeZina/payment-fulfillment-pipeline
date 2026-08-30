"use client";

import { useBasketStockSync } from "@/hooks/use-basket-stock-sync";
import { useBasketStore } from "@/stores/basket-store";
import { basketViewStyles } from "./basket-view.styles";
import type { BasketViewProps } from "./basket-view.types";

export function BasketView({ children, emptyState }: BasketViewProps) {
  useBasketStockSync();
  const { items } = useBasketStore();

  if (items.length === 0) {
    return emptyState;
  }

  return <div className={basketViewStyles.root}>{children}</div>;
}
