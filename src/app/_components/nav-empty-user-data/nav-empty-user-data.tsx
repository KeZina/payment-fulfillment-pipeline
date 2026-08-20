import Link from "next/link";
import {
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LogoutCircle01Icon,
  UserBlock02Icon,
} from "@hugeicons/core-free-icons";

export async function NavEmptyUserData() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger aria-label='Open sign-in menu'>
        <HugeiconsIcon
          icon={UserBlock02Icon}
          color='currentColor'
          strokeWidth={1.5}
          aria-hidden='true'
        />
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul>
          <li className='flex justify-around border-b'>
            <NavigationMenuLink
              render={
                <Link href='/sign-in'>
                  <HugeiconsIcon
                    icon={LogoutCircle01Icon}
                    color='currentColor'
                    strokeWidth={1.5}
                    aria-hidden='true'
                  />
                  <span>Log In</span>
                </Link>
              }
            />
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
