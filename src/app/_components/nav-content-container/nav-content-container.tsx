import { NavigationMenuList } from "@/components/ui/navigation-menu";
import { NavUserData } from "../nav-user-data";
import { Suspense } from "react";
import { NavSearch } from "@/components/nav/nav-search";
import { NavStoreLabel } from "@/components/nav/nav-store-label";
import { NavUserBasket } from "../nav-user-basket";
import { NavUserDataFallback } from "../nav-user-data-fallback";
import { navContentContainerStyles } from "./nav-content-container.styles";

export function NavContentContainer() {
  return (
    <NavigationMenuList className={navContentContainerStyles.root}>
      <NavStoreLabel />
      <NavSearch />
      <Suspense fallback={<NavUserDataFallback />}>
        <NavUserData />
      </Suspense>
      <NavUserBasket />
    </NavigationMenuList>
  );
}
