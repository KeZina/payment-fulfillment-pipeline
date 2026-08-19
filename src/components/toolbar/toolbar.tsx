import { cn } from "@/lib";
import { ToolbarProps } from "./toolbar.types";
import { WithChildren } from "@/types/with-children";

export function Toolbar({ classes, children }: ToolbarProps & WithChildren) {
  return (
    <div
      aria-label='Item filters'
      className={cn("flex items-center", classes?.root)}
      role='toolbar'
    >
      {children}
    </div>
  );
}
