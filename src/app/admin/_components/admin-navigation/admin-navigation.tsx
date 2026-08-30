import Link from "next/link";
import { ADMIN_NAVIGATION_ITEMS } from "@/constants";
import { cn } from "@/lib";
import { adminNavigationStyles } from "./admin-navigation.styles";
import type { AdminNavigationProps } from "./admin-navigation.types";

export function AdminNavigation({ active }: AdminNavigationProps) {
  return (
    <nav aria-label='Admin sections' className={adminNavigationStyles.root}>
      {ADMIN_NAVIGATION_ITEMS.map(({ section, href, label }) => {
        const isActive = active === section;

        return (
          <Link
            key={section}
            href={href}
            className={cn(
              adminNavigationStyles.link,
              isActive
                ? adminNavigationStyles.activeLink
                : adminNavigationStyles.inactiveLink,
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
