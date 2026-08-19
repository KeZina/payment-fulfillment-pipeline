import { Toolbar } from "@/components/toolbar";
import { NavMenu } from "../components/nav";
import { Items } from "./_components/items";
import { NavContentContainer } from "./_components/nav-content-container";
import { ToolbarContentContainer } from "./_components/toolbar-content-container";
import { Suspense } from "react";
import { Providers, ProvidersClient } from "./_components/providers";

export default function Page() {
  return (
    <Providers>
      <ProvidersClient>
        <div>
          <NavMenu>
            <Suspense>
              <NavContentContainer />
            </Suspense>
          </NavMenu>
          <Toolbar
            classes={{
              root: "mx-auto mt-4 w-fit max-w-[calc(100%_-_2rem)] flex-wrap justify-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm",
            }}
          >
            <Suspense>
              <ToolbarContentContainer />
            </Suspense>
          </Toolbar>
          <Suspense>
            <Items />
          </Suspense>
        </div>
      </ProvidersClient>
    </Providers>
  );
}
