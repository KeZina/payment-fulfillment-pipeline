import { ServerResponse } from "@/types";
import { isAPIError } from "better-auth/api";

export const handleError = (e: unknown): ServerResponse => {
  console.error(e);

  if (isAPIError(e) && e?.body?.message) {
    return {
      success: false,
      data: undefined,
      message: undefined,
      error: e.body.message,
    };
  }

  return {
    success: false,
    data: undefined,
    message: undefined,
    error: "Something went wrong",
  };
};
