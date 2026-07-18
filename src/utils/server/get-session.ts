import "server-only";
import { auth } from "@/utils/server";
import { headers } from "next/headers";

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}
