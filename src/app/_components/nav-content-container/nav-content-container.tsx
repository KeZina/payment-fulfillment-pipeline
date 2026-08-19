import { NavigationMenuList } from "@/components/ui/navigation-menu";
import { NavUserData } from "../nav-user-data";
import { Suspense } from "react";
import { NavSearch } from "@/components/nav/nav-search";
import { NavStoreLabel } from "@/components/nav/nav-store-label";
import { NavUserBasket } from "../nav-user-basket";
import { NavEmptyUserData } from "../nav-empty-user-data";

export function NavContentContainer() {
  return (
    <NavigationMenuList className='grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:grid-cols-[auto_minmax(12rem,36rem)_auto]'>
      <NavStoreLabel />
      <NavSearch />
      <ul className='col-start-2 row-start-1 flex items-center justify-self-end sm:col-start-3'>
        <Suspense fallback={<NavEmptyUserData />}>
          <NavUserData />
        </Suspense>
        <NavUserBasket />
      </ul>
    </NavigationMenuList>
  );
}
