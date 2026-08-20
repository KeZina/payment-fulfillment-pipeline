"use client";

import { useBasketStore } from "@/stores/basket-store";
import { formatBasketPrice } from "@/utils";

export function BasketSubtotal() {
  const { items } = useBasketStore();
  const subtotal = items.reduce(
    (total, item) => total + Number(item.salePrice) * item.quantity,
    0,
  );

  return formatBasketPrice(subtotal);
}
