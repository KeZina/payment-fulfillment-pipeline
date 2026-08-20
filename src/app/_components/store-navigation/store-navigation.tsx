import { Suspense } from "react";
import { NavMenu } from "@/components/nav";
import { NavContentContainer } from "../nav-content-container";

export function StoreNavigation() {
  return (
    <NavMenu>
      <Suspense>
        <NavContentContainer />
      </Suspense>
    </NavMenu>
  );
}
