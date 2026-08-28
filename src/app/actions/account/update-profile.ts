"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/server";
import { UpdateProfileSchema } from "@/schemas";
import type { UpdateProfileInput } from "@/types";
import {
  getSession,
  handleError,
  handleResponse,
  validateSchema,
} from "@/utils/server";

export async function updateProfile(input: UpdateProfileInput) {
  try {
    validateSchema(input, UpdateProfileSchema);

    const session = await getSession();

    if (!session) {
      throw new Error("You must be signed in");
    }

    const requestHeaders = await headers();
    const imageValue = input.image.trim() ? input.image.trim() : null;

    if (input.email !== session.user.email) {
      await auth.api.changeEmail({
        body: { newEmail: input.email },
        headers: requestHeaders,
      });
    }

    await auth.api.updateUser({
      body: {
        name: input.name,
        image: imageValue,
      },
      headers: requestHeaders,
    });
  } catch (e) {
    return handleError(e);
  }

  return handleResponse("Profile updated");
}
