import { NavigationMenu } from "@/components/ui/navigation-menu";
import { WithChildren } from "@/types";
import { navMenuStyles } from "./nav-menu.styles";

export function NavMenu({ children }: WithChildren) {
  return (
    <div className={navMenuStyles.sticky}>
      <NavigationMenu className={navMenuStyles.root}>
        {children}
      </NavigationMenu>
    </div>
  );
}
