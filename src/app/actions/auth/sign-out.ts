"use server";

import { handleError } from "@/utils/server";
import { auth } from "@/utils/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signOut() {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (e) {
    return handleError(e);
  }

  redirect("/");
}
