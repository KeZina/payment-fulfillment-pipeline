"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBasketAdd01Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AddToBasketResult } from "@/constants";
import { useBasketStore } from "@/stores/basket-store";
import { addToBasketButtonStyles } from "./add-to-basket-button.styles";
import type { AddToBasketButtonProps } from "./add-to-basket-button.types";

function getButtonLabel(basketQuantity: number, availableQuantity: number) {
  if (basketQuantity >= availableQuantity) {
    return `No items left · ${basketQuantity}/${availableQuantity}`;
  }

  if (basketQuantity > 0) {
    return `Add another · ${basketQuantity}/${availableQuantity}`;
  }

  return "Add item";
}

export function AddToBasketButton({ item }: AddToBasketButtonProps) {
  const { addItem, items } = useBasketStore();
  const basketQuantity =
    items.find((basketItem) => basketItem.id === item.id)?.quantity ?? 0;
  const isAtBasketLimit = basketQuantity >= item.quantity;
  const buttonLabel = getButtonLabel(basketQuantity, item.quantity);

  const handleAddItem = () => {
    const result = addItem(item);

    if (result === AddToBasketResult.LimitReached) {
      const itemLabel = item.quantity === 1 ? "item" : "items";
      toast.info(
        `All ${item.quantity} available ${itemLabel} are already in your basket.`,
      );
    }

    if (result === AddToBasketResult.OutOfStock) {
      toast.info(`${item.name} is no longer available.`);
    }
  };

  return (
    <Button
      type='button'
      size='xs'
      disabled={isAtBasketLimit}
      onClick={handleAddItem}
      aria-label={
        isAtBasketLimit
          ? `${item.name}: maximum available quantity is already in basket`
          : `Add ${item.name} to basket`
      }
      className={addToBasketButtonStyles.root}
    >
      <HugeiconsIcon
        aria-hidden='true'
        icon={ShoppingBasketAdd01Icon}
        strokeWidth={2}
        data-icon='inline-start'
      />
      <span aria-live='polite'>{buttonLabel}</span>
    </Button>
  );
}
