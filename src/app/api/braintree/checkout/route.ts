//TODO the route handler way too big, move the business logic into services and constants to the constants folder

import * as v from "valibot";
import { revalidateTag } from "next/cache";
import {
  auth,
  createSandboxCheckoutRequestFingerprint,
  fulfillSandboxCheckoutInventory,
  getBraintreeSandboxGateway,
  getBraintreeSandboxMerchantAccountId,
  getCheckoutQuote,
  getSandboxCheckoutLedgerState,
  recordSuccessfulSandboxCheckout,
} from "@/lib/server";
import { BraintreeCheckoutRequestSchema } from "@/schemas";
import { isSameOriginRequest } from "@/utils/server";
import type { BraintreeSandboxTransactionRequest } from "./route.types";

const MAX_REQUEST_BYTES = 16_384;
const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  Vary: "Cookie",
} as const;

function getConfiguredSandboxGateway() {
  try {
    return {
      gateway: getBraintreeSandboxGateway(),
      merchantAccountId: getBraintreeSandboxMerchantAccountId(),
    };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return Response.json(
      {
        success: false,
        sandbox: true,
        code: "INVALID_ORIGIN",
        message: "The checkout request origin is invalid.",
        retryable: false,
      },
      { status: 403, headers: NO_STORE_HEADERS },
    );
  }

  const sessionResult = await auth.api
    .getSession({ headers: request.headers })
    .then((session) => ({ session }))
    .catch(() => null);

  if (!sessionResult) {
    return Response.json(
      {
        success: false,
        sandbox: true,
        code: "CHECKOUT_UNAVAILABLE",
        message: "The sandbox checkout is temporarily unavailable.",
        retryable: true,
      },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }

  if (!sessionResult.session) {
    return Response.json(
      {
        success: false,
        sandbox: true,
        code: "UNAUTHORIZED",
        message: "Sign in again before placing a sandbox order.",
        retryable: false,
      },
      { status: 401, headers: NO_STORE_HEADERS },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  const contentType = request.headers.get("content-type") ?? "";
  const mediaType = contentType.split(";", 1)[0]?.trim().toLowerCase();

  if (
    contentLength > MAX_REQUEST_BYTES ||
    mediaType !== "application/json"
  ) {
    return Response.json(
      {
        success: false,
        sandbox: true,
        code: "INVALID_REQUEST",
        message: "The checkout request is invalid.",
        retryable: true,
      },
      {
        status: contentLength > MAX_REQUEST_BYTES ? 413 : 415,
        headers: NO_STORE_HEADERS,
      },
    );
  }

  let bodyText: string;

  try {
    bodyText = await request.text();
  } catch {
    return Response.json(
      {
        success: false,
        sandbox: true,
        code: "INVALID_REQUEST",
        message: "The checkout request is invalid.",
        retryable: true,
      },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  if (new TextEncoder().encode(bodyText).byteLength > MAX_REQUEST_BYTES) {
    return Response.json(
      {
        success: false,
        sandbox: true,
        code: "INVALID_REQUEST",
        message: "The checkout request is invalid.",
        retryable: true,
      },
      { status: 413, headers: NO_STORE_HEADERS },
    );
  }

  let body: unknown;

  try {
    body = JSON.parse(bodyText);
  } catch {
    return Response.json(
      {
        success: false,
        sandbox: true,
        code: "INVALID_REQUEST",
        message: "The checkout request is invalid.",
        retryable: true,
      },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  const parsedRequest = v.safeParse(BraintreeCheckoutRequestSchema, body);

  if (!parsedRequest.success) {
    return Response.json(
      {
        success: false,
        sandbox: true,
        code: "INVALID_REQUEST",
        message: "Check the delivery, basket, and payment details.",
        retryable: true,
      },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  const requestFingerprint = createSandboxCheckoutRequestFingerprint(
    parsedRequest.output.items,
    parsedRequest.output.expectedAmount,
  );
  const ledgerState = await getSandboxCheckoutLedgerState({
    idempotencyKey: parsedRequest.output.idempotencyKey,
    requestFingerprint,
    userId: sessionResult.session.user.id,
  }).catch(() => null);

  if (!ledgerState) {
    return Response.json(
      {
        success: false,
        sandbox: true,
        code: "CHECKOUT_UNAVAILABLE",
        message: "The sandbox checkout is temporarily unavailable.",
        retryable: true,
      },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }

  if (ledgerState.status === "conflict") {
    return Response.json(
      {
        success: false,
        sandbox: true,
        code: "INVALID_REQUEST",
        message: "The sandbox checkout request cannot be reused.",
        retryable: false,
      },
      { status: 409, headers: NO_STORE_HEADERS },
    );
  }

  if (ledgerState.status === "unfulfilled") {
    const recoveredCheckout = await fulfillSandboxCheckoutInventory({
      idempotencyKey: parsedRequest.output.idempotencyKey,
      items: parsedRequest.output.items,
      requestFingerprint,
      userId: sessionResult.session.user.id,
    }).catch((error: unknown) => {
      console.error(
        "Braintree Sandbox inventory recovery failed:",
        error instanceof Error ? error.message : "Unknown database error.",
      );
      return null;
    });

    if (recoveredCheckout?.status === "fulfilled") {
      try {
        revalidateTag("items", { expire: 0 });
      } catch {
        // Inventory is already durable; cache invalidation must not replay it.
      }

      return Response.json(
        {
          success: true,
          sandbox: true,
          transaction: recoveredCheckout.transaction,
        },
        { headers: NO_STORE_HEADERS },
      );
    }

    return Response.json(
      {
        success: false,
        sandbox: true,
        code: "PAYMENT_STATUS_UNKNOWN",
        message:
          "The sandbox transaction was recorded, but inventory fulfillment could not be confirmed.",
        retryable: false,
      },
      { status: 502, headers: NO_STORE_HEADERS },
    );
  }

  if (ledgerState.status === "fulfilled") {
    try {
      revalidateTag("items", { expire: 0 });
    } catch {
      // Inventory is already durable; cache invalidation must not replay it.
    }

    return Response.json(
      {
        success: true,
        sandbox: true,
        transaction: ledgerState.transaction,
      },
      { headers: NO_STORE_HEADERS },
    );
  }

  const quote = await getCheckoutQuote(parsedRequest.output.items).catch(
    () => null,
  );

  if (!quote) {
    return Response.json(
      {
        success: false,
        sandbox: true,
        code: "CHECKOUT_UNAVAILABLE",
        message: "The sandbox checkout is temporarily unavailable.",
        retryable: true,
      },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }

  if (
    !quote.success ||
    quote.amount !== parsedRequest.output.expectedAmount
  ) {
    return Response.json(
      {
        success: false,
        sandbox: true,
        code: "BASKET_CHANGED",
        message:
          "An item price or stock level changed. Return to your basket and re-add the affected items before trying again.",
        retryable: true,
      },
      { status: 409, headers: NO_STORE_HEADERS },
    );
  }

  const configuration = getConfiguredSandboxGateway();

  if (!configuration) {
    return Response.json(
      {
        success: false,
        sandbox: true,
        code: "SANDBOX_NOT_CONFIGURED",
        message: "Braintree Sandbox is not configured.",
        retryable: false,
      },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }

  const transactionRequest: BraintreeSandboxTransactionRequest = {
    amount: quote.amount,
    apiRequestKey: parsedRequest.output.idempotencyKey,
    orderId: `sandbox-${parsedRequest.output.idempotencyKey}`,
    paymentMethodNonce: parsedRequest.output.paymentMethodNonce,
    ...(configuration.merchantAccountId
      ? { merchantAccountId: configuration.merchantAccountId }
      : {}),
    options: {
      submitForSettlement: true,
    },
  };

  try {
    const result = await configuration.gateway.transaction.sale(
      transactionRequest,
    );

    if (!result.success) {
      return Response.json(
        {
          success: false,
          sandbox: true,
          code: "PAYMENT_NOT_APPROVED",
          message:
            "Braintree Sandbox did not approve the transaction. Review its test amount and card conditions before trying again.",
          retryable: true,
        },
        { status: 422, headers: NO_STORE_HEADERS },
      );
    }

    const transaction = {
      id: result.transaction.id,
      status: result.transaction.status,
      amount: result.transaction.amount,
      currency: result.transaction.currencyIsoCode,
    };
    const fulfilledCheckout = await recordSuccessfulSandboxCheckout({
      idempotencyKey: parsedRequest.output.idempotencyKey,
      items: parsedRequest.output.items,
      requestFingerprint,
      transaction,
      userId: sessionResult.session.user.id,
    }).catch((error: unknown) => {
      console.error(
        "Braintree Sandbox approved transaction fulfillment failed:",
        error instanceof Error ? error.message : "Unknown database error.",
      );
      return null;
    });

    if (!fulfilledCheckout || fulfilledCheckout.status !== "fulfilled") {
      return Response.json(
        {
          success: false,
          sandbox: true,
          code: "PAYMENT_STATUS_UNKNOWN",
          message:
            "The sandbox transaction was approved, but inventory fulfillment could not be confirmed. Check the Braintree Sandbox Control Panel before trying again.",
          retryable: false,
        },
        { status: 502, headers: NO_STORE_HEADERS },
      );
    }

    try {
      revalidateTag("items", { expire: 0 });
    } catch {
      // Inventory is already durable; cache invalidation must not replay it.
    }

    return Response.json(
      {
        success: true,
        sandbox: true,
        transaction: fulfilledCheckout.transaction,
      },
      { headers: NO_STORE_HEADERS },
    );
  } catch {
    return Response.json(
      {
        success: false,
        sandbox: true,
        code: "PAYMENT_STATUS_UNKNOWN",
        message:
          "The sandbox result could not be confirmed. Check the Braintree Sandbox Control Panel before trying again.",
        retryable: false,
      },
      { status: 502, headers: NO_STORE_HEADERS },
    );
  }
}
