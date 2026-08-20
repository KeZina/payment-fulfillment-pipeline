import { Search } from "@/components/search";
import { NavigationMenuItem } from "@/components/ui/navigation-menu";
import { navSearchStyles } from "./nav-search.styles";

export function NavSearch() {
  return (
    <NavigationMenuItem className={navSearchStyles.root}>
      <Search />
    </NavigationMenuItem>
  );
}
