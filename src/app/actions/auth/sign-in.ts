"use server";

import { handleError, validateSchema } from "@/utils/server";
import { auth } from "@/lib/server";
import { SignInSchema } from "@/schemas";
import { SignInCreds } from "@/types";
import { redirect } from "next/navigation";

export async function signIn(signInCreds: SignInCreds) {
  try {
    validateSchema(signInCreds, SignInSchema);
    await auth.api.signInEmail({ body: signInCreds });
  } catch (e) {
    return handleError(e);
  }

  redirect("/");
}
