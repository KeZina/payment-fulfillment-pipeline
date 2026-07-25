import Link from "next/link";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AccountSetting01Icon,
  HistoryIcon,
  LogoutCircle01Icon,
  UserCheck02Icon,
} from "@hugeicons/core-free-icons";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { getSession } from "@/utils/server/get-session";
import { NavEmptyUserData } from "../nav-empty-user-data";

export async function NavUserData() {
  const session = await getSession();

  return (
    <>
      {session ? (
        <NavigationMenuItem>
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
                    <Link className='flex items-center' href='/user/settings'>
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
                    <Link className='flex items-center' href='/user/history'>
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
        </NavigationMenuItem>
      ) : (
        <NavEmptyUserData />
      )}
    </>
  );
}
