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
} from "@hugeicons/core-free-icons";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { getSession } from "@/utils/server/get-session";
import { NavEmptyUserData } from "../nav-empty-user-data";
import { NavUserAvatar } from "../nav-user-avatar";

export async function NavUserData() {
  const session = await getSession();

  return (
    <>
      {session ? (
        <NavigationMenuItem>
          <NavigationMenuTrigger
            aria-label={`Open account menu for ${session.user.name}`}
            className='px-2'
          >
            <NavUserAvatar
              name={session.user.name}
              image={session.user.image}
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
                    <Link href='/user/settings'>
                      <HugeiconsIcon
                        icon={AccountSetting01Icon}
                        color='currentColor'
                        strokeWidth={1.5}
                        aria-hidden='true'
                      />
                      <span>Account</span>
                    </Link>
                  }
                />
              </li>
              <li>
                <NavigationMenuLink
                  render={
                    <Link href='/user/history'>
                      <HugeiconsIcon
                        icon={HistoryIcon}
                        color='currentColor'
                        strokeWidth={1.5}
                        aria-hidden='true'
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
                    data-icon='inline-start'
                    aria-hidden='true'
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
