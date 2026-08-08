import { Menubar } from "@/components/ui/menubar";
import { ToolbarProps } from "./toolbar.types";
import { WithChildren } from "@/types/with-children";

export function Toolbar({ classes, children }: ToolbarProps & WithChildren) {
  return <Menubar className={classes?.root}>{children}</Menubar>;
}
