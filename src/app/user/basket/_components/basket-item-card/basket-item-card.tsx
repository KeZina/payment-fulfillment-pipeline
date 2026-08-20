"use client";

import {
  Add01Icon,
  Delete02Icon,
  MinusSignIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { foodIllustrationClasses } from "@/app/_components/item-card/item-card.styles";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib";
import { useBasketStore } from "@/stores/basket-store";
import { formatBasketPrice } from "@/utils";
import { basketItemCardStyles } from "./basket-item-card.styles";
import type { BasketItemCardProps } from "./basket-item-card.types";

export function BasketItemCard({ item }: BasketItemCardProps) {
  const { decreaseItemQuantity, increaseItemQuantity, removeItem } =
    useBasketStore();
  const accentClass =
    foodIllustrationClasses[item.id % foodIllustrationClasses.length];
  const isAtQuantityLimit = item.quantity >= item.availableQuantity;

  const handleDecreaseItemQuantity = () => {
    decreaseItemQuantity(item.id);
  };

  const handleIncreaseItemQuantity = () => {
    increaseItemQuantity(item.id);
  };

  const handleRemoveItem = () => {
    removeItem(item.id);
  };

  return (
    <Item
      role='listitem'
      variant='outline'
      size='sm'
      className={basketItemCardStyles.root}
    >
      <ItemMedia
        aria-hidden='true'
        className={cn(basketItemCardStyles.illustration, accentClass)}
      >
        <div className={basketItemCardStyles.illustrationOverlay} />
        <div className={basketItemCardStyles.illustrationAccent} />
      </ItemMedia>

      <ItemContent className={basketItemCardStyles.details}>
        <ItemTitle>{item.name}</ItemTitle>
        <span className={basketItemCardStyles.price}>
          {formatBasketPrice(item.salePrice)}
        </span>
        <ItemDescription className={basketItemCardStyles.availability}>
          {item.availableQuantity} available
        </ItemDescription>
      </ItemContent>

      <ItemActions className={basketItemCardStyles.actions}>
        <div className={basketItemCardStyles.quantityControl}>
          <Button
            type='button'
            variant='ghost'
            size='icon-xs'
            onClick={handleDecreaseItemQuantity}
            aria-label={`Decrease ${item.name} quantity`}
          >
            <HugeiconsIcon
              aria-hidden='true'
              icon={MinusSignIcon}
              strokeWidth={2}
            />
          </Button>
          <Separator
            orientation='vertical'
            className={basketItemCardStyles.separator}
          />
          <output
            aria-label={`${item.name} quantity`}
            className={basketItemCardStyles.quantity}
          >
            {item.quantity}
          </output>
          <Separator
            orientation='vertical'
            className={basketItemCardStyles.separator}
          />
          <Button
            type='button'
            variant='ghost'
            size='icon-xs'
            disabled={isAtQuantityLimit}
            onClick={handleIncreaseItemQuantity}
            aria-label={
              isAtQuantityLimit
                ? `${item.name} is at the available stock limit`
                : `Increase ${item.name} quantity`
            }
          >
            <HugeiconsIcon
              aria-hidden='true'
              icon={Add01Icon}
              strokeWidth={2}
            />
          </Button>
        </div>

        <Button
          type='button'
          variant='destructive'
          size='icon-sm'
          onClick={handleRemoveItem}
          aria-label={`Remove ${item.name} from basket`}
        >
          <HugeiconsIcon
            aria-hidden='true'
            icon={Delete02Icon}
            strokeWidth={1.8}
          />
        </Button>
      </ItemActions>
    </Item>
  );
}
