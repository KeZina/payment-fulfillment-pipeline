import { Suspense } from "react";
import { NavMenu } from "../components/nav";
import { NavContentContainer } from "./_components/nav-content-container";

export default function Page() {
  return (
    <div>
      <NavMenu>
        <Suspense fallback={<div>12345</div>}>
          <NavContentContainer />
        </Suspense>
      </NavMenu>
      Hola!
    </div>
  );
}
