import Link from "next/link";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Search } from "../../../components/search";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AccountSetting01Icon,
  HistoryIcon,
  LogoutCircle01Icon,
  ShoppingBasket02Icon,
  UserBlock02Icon,
  UserCheck02Icon,
} from "@hugeicons/core-free-icons";
import { NavStoreLabel } from "../../../components/nav/nav-store-label";
import { NavContentProps } from "./nav-content.types";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export function NavContent({ session }: NavContentProps) {
  return (
    <NavigationMenuList className='w-[100%] justify-between'>
      <NavStoreLabel />
      <NavigationMenuItem>
        <Search />
      </NavigationMenuItem>
      <ul className='flex items-center'>
        <NavigationMenuItem>
          {!session && (
            <>
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
            </>
          )}
          {session && (
            <>
              <NavigationMenuTrigger>
                <HugeiconsIcon
                  icon={UserCheck02Icon}
                  color='currentColor'
                  strokeWidth={1.5}
                />
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul>
                  <li className='flex justify-around border-b'>
                    <span className='text-xs'>{session.user.email}</span>
                  </li>
                  <li>
                    <NavigationMenuLink
                      render={
                        <Link
                          className='flex items-center'
                          href='/user/settings'
                        >
                          <HugeiconsIcon
                            icon={AccountSetting01Icon}
                            color='currentColor'
                            strokeWidth={1.5}
                          />
                          <span>Account</span>
                        </Link>
                      }
                    />
                  </li>
                  <li>
                    <NavigationMenuLink
                      render={
                        <Link
                          className='flex items-center'
                          href='/user/history'
                        >
                          <HugeiconsIcon
                            icon={HistoryIcon}
                            color='currentColor'
                            strokeWidth={1.5}
                          />
                          <span>History</span>
                        </Link>
                      }
                    />
                  </li>
                  <li>
                    <Button variant='ghost' onClick={signOut}>
                      <HugeiconsIcon
                        icon={LogoutCircle01Icon}
                        color='currentColor'
                        strokeWidth={1.5}
                      />
                      <span>Log Out</span>
                    </Button>
                  </li>
                </ul>
              </NavigationMenuContent>
            </>
          )}
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            render={
              <Link href='/user/basket'>
                <HugeiconsIcon
                  icon={ShoppingBasket02Icon}
                  color='currentColor'
                  strokeWidth={1.5}
                />
              </Link>
            }
          />
        </NavigationMenuItem>
      </ul>
    </NavigationMenuList>
  );
}
