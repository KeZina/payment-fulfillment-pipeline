"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/server";
import { DeleteAccountSchema } from "@/schemas";
import type { DeleteAccountInput } from "@/types";
import {
  getSession,
  handleError,
  validateSchema,
} from "@/utils/server";

export async function deleteAccount(input: DeleteAccountInput) {
  try {
    validateSchema(input, DeleteAccountSchema);

    const session = await getSession();

    if (!session) {
      throw new Error("You must be signed in");
    }

    await auth.api.deleteUser({
      body: { password: input.password },
      headers: await headers(),
    });
  } catch (e) {
    return handleError(e);
  }

  redirect("/");
}
