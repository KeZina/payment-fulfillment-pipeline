import {
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { navUserAvatarStyles } from "../nav-user-avatar/nav-user-avatar.styles";

export function NavUserDataFallback() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        aria-hidden
        className='pointer-events-none px-2'
        tabIndex={-1}
      >
        <span
          className={`${navUserAvatarStyles.initials} animate-pulse`}
          aria-hidden='true'
        />
      </NavigationMenuTrigger>
    </NavigationMenuItem>
  );
}
