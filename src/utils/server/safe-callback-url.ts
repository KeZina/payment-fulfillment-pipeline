import "server-only";

import { SAFE_CALLBACK_URL_PATH_REGEX } from "@/constants/auth";

export function resolveSafeCallbackUrl(
  callbackUrl: string | null | undefined,
  fallback = "/",
) {
  if (!callbackUrl || !SAFE_CALLBACK_URL_PATH_REGEX.test(callbackUrl)) {
    return fallback;
  }

  return callbackUrl;
}
