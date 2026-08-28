"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/server";
import { ChangePasswordSchema } from "@/schemas";
import type { ChangePasswordInput } from "@/types";
import {
  getSession,
  handleError,
  handleResponse,
  validateSchema,
} from "@/utils/server";

export async function changePassword(input: ChangePasswordInput) {
  try {
    validateSchema(input, ChangePasswordSchema);

    const session = await getSession();

    if (!session) {
      throw new Error("You must be signed in");
    }

    await auth.api.changePassword({
      body: {
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
        revokeOtherSessions: false,
      },
      headers: await headers(),
    });
  } catch (e) {
    return handleError(e);
  }

  return handleResponse("Password updated");
}
