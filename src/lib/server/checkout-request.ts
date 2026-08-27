import "server-only";

import * as v from "valibot";
import { revalidateTag } from "next/cache";
import {
  CheckoutErrorCode,
  MAX_CHECKOUT_REQUEST_BYTES,
  NO_STORE_HEADERS,
} from "@/constants";
import type { CheckoutErrorCodeValue } from "@/constants";
import { CheckoutRequestSchema } from "@/schemas";
import type { SandboxTransactionSnapshot } from "./checkout.types";
import type {
  CheckoutErrorResponseBody,
  ParseCheckoutRequestResult,
} from "./checkout-request.types";

export function checkoutErrorResponse(
  code: CheckoutErrorCodeValue,
  message: string,
  status: number,
  retryable: boolean,
) {
  const body: CheckoutErrorResponseBody = {
    success: false,
    sandbox: true,
    code,
    message,
    retryable,
  };

  return Response.json(body, { status, headers: NO_STORE_HEADERS });
}

export function checkoutSuccessResponse(transaction: SandboxTransactionSnapshot) {
  return Response.json(
    {
      success: true,
      sandbox: true,
      transaction,
    },
    { headers: NO_STORE_HEADERS },
  );
}

export function clientTokenErrorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status, headers: NO_STORE_HEADERS });
}

export function clientTokenSuccessResponse(clientToken: string) {
  return Response.json(
    { clientToken, sandbox: true },
    { headers: NO_STORE_HEADERS },
  );
}

export function revalidateItemsCatalog() {
  try {
    revalidateTag("items", { expire: 0 });
  } catch {
    // Inventory is already durable; cache invalidation must not replay it.
  }
}

export async function parseCheckoutRequest(
  request: Request,
): Promise<ParseCheckoutRequestResult> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  const contentType = request.headers.get("content-type") ?? "";
  const mediaType = contentType.split(";", 1)[0]?.trim().toLowerCase();

  if (
    contentLength > MAX_CHECKOUT_REQUEST_BYTES ||
    mediaType !== "application/json"
  ) {
    return {
      ok: false,
      response: checkoutErrorResponse(
        CheckoutErrorCode.InvalidRequest,
        "The checkout request is invalid.",
        contentLength > MAX_CHECKOUT_REQUEST_BYTES ? 413 : 415,
        true,
      ),
    };
  }

  let bodyText: string;

  try {
    bodyText = await request.text();
  } catch {
    return {
      ok: false,
      response: checkoutErrorResponse(
        CheckoutErrorCode.InvalidRequest,
        "The checkout request is invalid.",
        400,
        true,
      ),
    };
  }

  if (
    new TextEncoder().encode(bodyText).byteLength >
    MAX_CHECKOUT_REQUEST_BYTES
  ) {
    return {
      ok: false,
      response: checkoutErrorResponse(
        CheckoutErrorCode.InvalidRequest,
        "The checkout request is invalid.",
        413,
        true,
      ),
    };
  }

  let body: unknown;

  try {
    body = JSON.parse(bodyText);
  } catch {
    return {
      ok: false,
      response: checkoutErrorResponse(
        CheckoutErrorCode.InvalidRequest,
        "The checkout request is invalid.",
        400,
        true,
      ),
    };
  }

  const parsedRequest = v.safeParse(CheckoutRequestSchema, body);

  if (!parsedRequest.success) {
    return {
      ok: false,
      response: checkoutErrorResponse(
        CheckoutErrorCode.InvalidRequest,
        "Check the delivery, basket, and payment details.",
        400,
        true,
      ),
    };
  }

  return { ok: true, data: parsedRequest.output };
}
