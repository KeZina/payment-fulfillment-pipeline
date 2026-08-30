import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { navStoreLabelStyles } from "./nav-store-label.styles";

export function NavStoreLabel() {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        render={<Link href='/' />}
      >
        <span className={navStoreLabelStyles.label}>Pantry</span>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}
