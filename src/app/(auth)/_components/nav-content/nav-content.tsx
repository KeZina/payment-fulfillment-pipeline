import { NavigationMenuList } from "@/components/ui/navigation-menu";
import { NavStoreLabel } from "@/components/nav";

export function NavContent() {
  return (
    <NavigationMenuList className='w-[50%] justify-center'>
      <NavStoreLabel />
    </NavigationMenuList>
  );
}
