import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib";
import {
  itemCardClassName,
  itemCardStyles,
  outOfStockItemCardClassName,
} from "./item-card.styles";
import type { ItemCardProps } from "./item-card.types";
import { AddToBasketButton } from "./add-to-basket-button";

function formatDiscountLabel(discount: string) {
  const percent = Math.round(Number(discount) * 100);
  return percent > 0 ? `-${percent}%` : null;
}

export function ItemCard({ item, isPlaceholder, ref }: ItemCardProps) {
  const isOutOfStock = !isPlaceholder && item.quantity === 0;
  const isAlmostOutOfStock =
    !isPlaceholder && item.quantity > 0 && item.quantity < 5;
  const hasDiscount = !isPlaceholder && Number(item.discount) > 0;
  const discountLabel = hasDiscount ? formatDiscountLabel(item.discount) : null;
  const lowStockItemLabel = item.quantity === 1 ? "item" : "items";

  return (
    <div
      ref={ref}
      className={cn(
        itemCardClassName,
        isPlaceholder && "opacity-50",
        isOutOfStock && outOfStockItemCardClassName,
      )}
    >
      <div className={itemCardStyles.imageWrapper}>
        {isPlaceholder ? (
          <div className='h-32 w-full animate-pulse bg-slate-100 sm:h-36' />
        ) : (
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={640}
            height={480}
            className={cn(itemCardStyles.image, isOutOfStock && "grayscale")}
          />
        )}
        {discountLabel ? (
          <Badge className={itemCardStyles.badge}>{discountLabel}</Badge>
        ) : null}
        {isOutOfStock ? (
          <span className='absolute inset-x-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/85 px-2 py-1 text-center text-[0.6rem] font-bold uppercase tracking-wide text-white'>
            Out of stock
          </span>
        ) : isAlmostOutOfStock ? (
          <span className='absolute inset-x-2 bottom-2 rounded-md bg-amber-50/95 px-1.5 py-1 text-center text-[0.55rem] font-bold leading-tight text-amber-800 ring-1 ring-amber-300'>
            Only {item.quantity} {lowStockItemLabel} left
          </span>
        ) : null}
      </div>

      <div className='flex flex-1 flex-col'>
        <h3 className={itemCardStyles.title}>{item.name}</h3>
        {!isPlaceholder && item.description ? (
          <p className={itemCardStyles.description}>{item.description}</p>
        ) : null}

        <div className={itemCardStyles.priceRow}>
          {hasDiscount ? (
            <span className={itemCardStyles.originalPrice}>
              ${Number(item.price).toFixed(2)}
            </span>
          ) : null}
          <p
            className={cn(
              itemCardStyles.salePrice,
              isOutOfStock && itemCardStyles.outOfStockPrice,
            )}
          >
            ${Number(item.salePrice).toFixed(2)}
          </p>
        </div>

        {!isPlaceholder && !isOutOfStock ? (
          <p className={itemCardStyles.stockLabel}>
            {item.quantity} in stock
          </p>
        ) : null}

        {!isPlaceholder && isAlmostOutOfStock ? (
          <p className={itemCardStyles.lowStockLabel}>Almost out of stock</p>
        ) : null}

        {!isPlaceholder && !isOutOfStock ? (
          <AddToBasketButton item={item} />
        ) : null}
      </div>
    </div>
  );
}
