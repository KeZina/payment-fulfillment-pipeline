import { Toolbar } from "@/components/toolbar";
import { NavMenu } from "../components/nav";
import { Items } from "./_components/items";
import { NavContentContainer } from "./_components/nav-content-container";
import { ToolbarContentContainer } from "./_components/toolbar-content-container";
import { Suspense } from "react";
import { Providers, ProvidersClient } from "./_components/providers";
import { SearchParams } from "nuqs/server";

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Providers searchParams={searchParams}>
      <ProvidersClient>
        <div>
          <NavMenu>
            <Suspense>
              <NavContentContainer />
            </Suspense>
          </NavMenu>
          <Toolbar
            classes={{
              root: "w-1/3 justify-center m-auto border-0",
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
