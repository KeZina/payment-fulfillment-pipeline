import { NavigationMenu } from "@/components/ui/navigation-menu";
import { WithChildren } from "@/types";

export function NavMenu({ children }: WithChildren) {
  return (
    <NavigationMenu className='w-full max-w-full p-2'>
      {children}
    </NavigationMenu>
  );
}
