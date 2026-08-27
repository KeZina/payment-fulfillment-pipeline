import "client-only";

import * as v from "valibot";
import {
  CHECKOUT_REQUEST_HEADERS,
  CHECKOUT_REQUEST_INIT,
  CLIENT_TOKEN_REQUEST,
  POST_CHECKOUT_REQUEST,
} from "@/constants";
import { CheckoutResponseSchema, ClientTokenResponseSchema } from "@/schemas";
import type { SubmitCheckoutRequestParams } from "@/app/user/checkout/_components/checkout-form/checkout-form.types";
import { buildCheckoutRequestBody } from "./checkout-form-submit";

export async function fetchSandboxClientToken(
  _key: string,
  { signal }: { signal?: AbortSignal } = {},
) {
  const tokenResponse = await fetch(CLIENT_TOKEN_REQUEST.url, {
    method: CLIENT_TOKEN_REQUEST.method,
    cache: CLIENT_TOKEN_REQUEST.cache,
    credentials: CLIENT_TOKEN_REQUEST.credentials,
    headers: CLIENT_TOKEN_REQUEST.headers,
    signal,
  });

  if (!tokenResponse.ok) {
    throw new Error("Braintree Sandbox client token request failed.");
  }

  const tokenBody: unknown = await tokenResponse.json();
  const parsedToken = v.safeParse(ClientTokenResponseSchema, tokenBody);

  if (!parsedToken.success) {
    throw new Error("Braintree Sandbox client token is invalid.");
  }

  return parsedToken.output.clientToken;
}

export async function submitCheckoutRequestFetcher(
  _key: string,
  { arg }: { arg: SubmitCheckoutRequestParams },
) {
  const response = await fetch(POST_CHECKOUT_REQUEST, {
    ...CHECKOUT_REQUEST_INIT,
    headers: CHECKOUT_REQUEST_HEADERS,
    body: JSON.stringify(buildCheckoutRequestBody(arg)),
  });

  const responseBody: unknown = await response.json();
  const parsedResponse = v.safeParse(CheckoutResponseSchema, responseBody);

  return parsedResponse.success ? parsedResponse.output : null;
}
