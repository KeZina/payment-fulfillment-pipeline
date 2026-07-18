import { ServerResponse } from "@/types";
import { isAPIError } from "better-auth/api";

export const handleError = (e: unknown): ServerResponse => {
  let errorMessage = "Something went wrong";

  if (isAPIError(e) && e?.body?.message) {
    errorMessage = e.body.message;
  } else if (e instanceof Error && e?.message) {
    errorMessage = e.message;
  }

  return {
    success: false,
    data: undefined,
    message: undefined,
    error: errorMessage,
  };
};
