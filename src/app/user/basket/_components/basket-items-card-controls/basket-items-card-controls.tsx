"use client";

import { Button } from "@/components/ui/button";
import {
  CardAction,
  CardDescription,
} from "@/components/ui/card";
import { useBasketStore } from "@/stores/basket-store";
import { basketItemsCardControlsStyles } from "./basket-items-card-controls.styles";

export function BasketItemsCardControls() {
  const { clearBasket, items } = useBasketStore();
  const totalQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const itemLabel = totalQuantity === 1 ? "item" : "items";

  return (
    <>
      <CardDescription
        className={basketItemsCardControlsStyles.description}
      >
        {totalQuantity} {itemLabel} selected
      </CardDescription>
      <CardAction>
        <Button
          type='button'
          variant='destructive'
          size='sm'
          onClick={clearBasket}
        >
          Clear basket
        </Button>
      </CardAction>
    </>
  );
}
