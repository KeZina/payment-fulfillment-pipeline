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
      <NavigationMenuTrigger>
        <HugeiconsIcon
          icon={UserBlock02Icon}
          color='currentColor'
          strokeWidth={1.5}
        />
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul>
          <li className='flex justify-around border-b'>
            <NavigationMenuLink
              render={
                <Link className='flex items-center' href='/sign-in'>
                  <HugeiconsIcon
                    icon={LogoutCircle01Icon}
                    color='currentColor'
                    strokeWidth={1.5}
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
