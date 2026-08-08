import Link from "next/link";
import {
  NavigationMenuLink,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBasket02Icon } from "@hugeicons/core-free-icons";

export function NavUserBasket() {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        render={
          <Link href='/user/basket'>
            <HugeiconsIcon
              icon={ShoppingBasket02Icon}
              color='currentColor'
              strokeWidth={1.5}
            />
          </Link>
        }
      />
    </NavigationMenuItem>
  );
}
