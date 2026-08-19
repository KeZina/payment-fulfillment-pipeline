import { getCachedDefaultItemsPage } from "@/lib/server";
import {
  createItemsGetKey,
  DEFAULT_ITEMS_REQUEST_QUERY,
} from "@/utils/items-request";
import { SWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";

export async function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialPage = await getCachedDefaultItemsPage();
  const defaultGetKey = createItemsGetKey(DEFAULT_ITEMS_REQUEST_QUERY);

  return (
    <SWRConfig
      value={{
        fallback: {
          [unstable_serialize(defaultGetKey)]: [initialPage],
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
