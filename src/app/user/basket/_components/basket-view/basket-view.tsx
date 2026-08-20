"use client";

import { useBasketStore } from "@/stores/basket-store";
import { basketViewStyles } from "./basket-view.styles";
import type { BasketViewProps } from "./basket-view.types";

export function BasketView({ children, emptyState }: BasketViewProps) {
  const { items } = useBasketStore();

  if (items.length === 0) {
    return emptyState;
  }

  return <div className={basketViewStyles.root}>{children}</div>;
}
