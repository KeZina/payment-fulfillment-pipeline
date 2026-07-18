import { NavMenu } from "@/components/nav";
import { WithChildren } from "@/types";
import { NavContent } from "./_components/nav-content";

export default function Layout({ children }: WithChildren) {
  return (
    <div>
      <NavMenu>
        <NavContent />
      </NavMenu>
      <div className='flex justify-center mt-16'>{children}</div>
    </div>
  );
}
