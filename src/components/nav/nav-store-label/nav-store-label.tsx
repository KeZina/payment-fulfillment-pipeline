import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

export function NavStoreLabel() {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        className='text-xl font-bold'
        render={<Link href='/'>Store Name</Link>}
      />
    </NavigationMenuItem>
  );
}
