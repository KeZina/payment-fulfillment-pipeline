"use client";

import Link from "next/link";
import {
  NavigationMenuLink,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBasket02Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { useBasketStore } from "@/stores/basket-store";
import { navUserBasketStyles } from "./nav-user-basket.styles";

export function NavUserBasket() {
  const { items } = useBasketStore();
  const totalQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const itemLabel = totalQuantity === 1 ? "item" : "items";
  const badgeLabel = totalQuantity > 99 ? "99+" : totalQuantity;

  return (
    <NavigationMenuItem className={navUserBasketStyles.root}>
      <NavigationMenuLink
        className={navUserBasketStyles.link}
        render={
          <Link
            href='/user/basket'
            aria-label={`Basket with ${totalQuantity} ${itemLabel}`}
          >
            <span className={navUserBasketStyles.iconContainer}>
              <HugeiconsIcon
                icon={ShoppingBasket02Icon}
                color='currentColor'
                strokeWidth={1.5}
                aria-hidden='true'
              />
              {totalQuantity > 0 ? (
                <Badge className={navUserBasketStyles.badge}>
                  {badgeLabel}
                </Badge>
              ) : null}
            </span>
          </Link>
        }
      />
    </NavigationMenuItem>
  );
}
