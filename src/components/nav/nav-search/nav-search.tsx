"use client";

import { usePathname } from "next/navigation";
import { Search } from "@/components/search";
import { SearchRouteBehavior } from "@/constants/search-route";
import { resolveSearchRouteConfig } from "@/utils/resolve-search-route-config";
import { NavigationMenuItem } from "@/components/ui/navigation-menu";
import { navSearchStyles } from "./nav-search.styles";

export function NavSearch() {
  const pathname = usePathname();
  const routeConfig = resolveSearchRouteConfig(pathname);

  if (routeConfig.behavior === SearchRouteBehavior.Hidden) {
    return (
      <NavigationMenuItem aria-hidden className={navSearchStyles.root}>
        <div aria-hidden='true' className={navSearchStyles.placeholder} />
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem className={navSearchStyles.root}>
      <Search routeConfig={routeConfig} />
    </NavigationMenuItem>
  );
}
