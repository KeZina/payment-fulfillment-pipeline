"use server";

import { handleError, validateSchema } from "@/utils/server";
import { auth } from "@/lib/server";
import { SignUpSchema } from "@/schemas";
import { SignUpCreds } from "@/types";
import { redirect } from "next/navigation";
import { UserRole } from "@/constants/auth";

export async function signUp(signUpCreds: SignUpCreds) {
  try {
    validateSchema(signUpCreds, SignUpSchema);
    await auth.api.signUpEmail({
      body: { ...signUpCreds, role: UserRole.User },
    });
  } catch (e) {
    return handleError(e);
  }

  redirect("/");
}
