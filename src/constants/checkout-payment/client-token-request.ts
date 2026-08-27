import { POST_CLIENT_TOKEN_REQUEST } from "../braintree";

export const CLIENT_TOKEN_REQUEST = {
  url: POST_CLIENT_TOKEN_REQUEST,
  method: "POST" as const,
  cache: "no-store" as const,
  credentials: "same-origin" as const,
  headers: { Accept: "application/json" },
};
