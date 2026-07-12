import { LayoutWithChildren } from "@/types";
import { Navigation } from "./_components/navigation";

export default function LayoutWithHeader({ children }: LayoutWithChildren) {
  return (
    <div>
      <Navigation />
      {children}
    </div>
  );
}
