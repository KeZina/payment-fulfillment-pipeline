import { NavigationMenuList } from "@/components/ui/navigation-menu";
import { NavUserData } from "../nav-user-data";
import { Suspense } from "react";
import { NavSearch } from "@/components/nav/nav-search";
import { NavStoreLabel } from "@/components/nav/nav-store-label";
import { NavUserBasket } from "../nav-user-basket";
import { NavEmptyUserData } from "../nav-empty-user-data";

export function NavContentContainer() {
  return (
    <NavigationMenuList className='w-[100%] justify-between'>
      <NavStoreLabel />
      <NavSearch />
      <ul className='flex items-center'>
        <Suspense fallback={<NavEmptyUserData />}>
          <NavUserData />
        </Suspense>
        <NavUserBasket />
      </ul>
    </NavigationMenuList>
  );
}
