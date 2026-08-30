import { cache } from "react";
import { auth } from "@/lib/server";
import { headers } from "next/headers";

// Memoized per request: several places in a single render (e.g. the admin
// layout guard and the nav's user menu) call this independently.
export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});
