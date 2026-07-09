import { LayoutWithChildren } from "@/types";
import { Header } from "./_components/Header";

export default function LayoutWithHeader({ children }: LayoutWithChildren) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
