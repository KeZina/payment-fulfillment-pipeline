import { Search } from "@/components/search";
import { NavigationMenuItem } from "@/components/ui/navigation-menu";

export function NavSearch() {
  return (
    <NavigationMenuItem className='col-span-2 row-start-2 w-full min-w-0 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:justify-self-center'>
      <Search />
    </NavigationMenuItem>
  );
}
