import useSWR from "swr";
import { POST_CLIENT_TOKEN_REQUEST } from "@/constants";
import { fetchSandboxClientToken } from "@/utils/client/checkout-request";

export function useSandboxClientToken(enabled = true) {
  return useSWR(
    enabled ? POST_CLIENT_TOKEN_REQUEST : null,
    fetchSandboxClientToken,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      dedupingInterval: 60_000,
    },
  );
}
