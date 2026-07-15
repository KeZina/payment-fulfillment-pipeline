import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Search } from "../search";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AccountSetting01Icon,
  HistoryIcon,
  LoginCircle01Icon,
  LogoutCircle01Icon,
  ShoppingBasket02Icon,
  UserBlock02Icon,
} from "@hugeicons/core-free-icons";

export function Navigation() {
  return (
    <NavigationMenu className='w-full max-w-full p-2'>
      <NavigationMenuList className='w-[100%] justify-between'>
        <NavigationMenuItem>
          <NavigationMenuLink
            className='text-xl font-bold'
            render={<Link href='/'>Store Name</Link>}
          />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Search />
        </NavigationMenuItem>
        <ul className='flex items-center'>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <HugeiconsIcon
                icon={UserBlock02Icon}
                // icon={UserCheck02FreeIcons}
                color='currentColor'
                strokeWidth={1.5}
              />
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul>
                <li className='flex justify-around border-b'>
                  <span className='text-xs'>blabla@bla.bla</span>
                </li>
                <li>
                  <NavigationMenuLink
                    render={
                      <Link className='flex items-center' href='/user/settings'>
                        <HugeiconsIcon
                          icon={AccountSetting01Icon}
                          size={24}
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
                      <Link className='flex items-center' href='/user/history'>
                        <HugeiconsIcon
                          icon={HistoryIcon}
                          size={24}
                          color='currentColor'
                          strokeWidth={1.5}
                        />
                        <span>History</span>
                      </Link>
                    }
                  />
                </li>
                <li>
                  <NavigationMenuLink
                    render={
                      <Link className='flex items-center' href='/login'>
                        <HugeiconsIcon
                          icon={LoginCircle01Icon}
                          size={24}
                          color='currentColor'
                          strokeWidth={1.5}
                        />
                        <span>Log In</span>
                      </Link>
                    }
                  />
                  {/* <NavigationMenuLink
                    render={
                      <Link className='flex items-center' href='/user/settings'>
                        <HugeiconsIcon
                          icon={LogoutCircle01Icon}
                          size={24}
                          color='currentColor'
                          strokeWidth={1.5}
                        />
                        <span>Log Out</span>
                      </Link>
                    }
                  /> */}
                </li>
              </ul>
            </NavigationMenuContent>
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
    </NavigationMenu>
  );
}
