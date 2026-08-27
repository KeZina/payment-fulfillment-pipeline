import {
  auth,
  createSandboxCheckoutRequestFingerprint,
  fulfillSandboxCheckoutInventory,
  getCheckoutQuote,
  getConfiguredSandboxGateway,
  getSandboxCheckoutLedgerState,
  checkoutErrorResponse,
  checkoutSuccessResponse,
  parseCheckoutRequest,
  persistCheckoutOrder,
  recordSuccessfulSandboxCheckout,
  revalidateItemsCatalog,
} from "@/lib/server";
import {
  SANDBOX_ORDER_ID_PREFIX,
  CheckoutErrorCode,
  SandboxCheckoutLedgerStatus,
} from "@/constants";
import { isSameOriginRequest } from "@/utils/server";
import type { SandboxTransactionRequest } from "./route.types";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return checkoutErrorResponse(
      CheckoutErrorCode.InvalidOrigin,
      "The checkout request origin is invalid.",
      403,
      false,
    );
  }

  const sessionResult = await auth.api
    .getSession({ headers: request.headers })
    .then((session) => ({ session }))
    .catch(() => null);

  if (!sessionResult) {
    return checkoutErrorResponse(
      CheckoutErrorCode.CheckoutUnavailable,
      "The sandbox checkout is temporarily unavailable.",
      503,
      true,
    );
  }

  if (!sessionResult.session) {
    return checkoutErrorResponse(
      CheckoutErrorCode.Unauthorized,
      "Sign in again before placing a sandbox order.",
      401,
      false,
    );
  }

  const parsedRequestResult = await parseCheckoutRequest(request);

  if (!parsedRequestResult.ok) {
    return parsedRequestResult.response;
  }

  const parsedRequest = parsedRequestResult.data;
  const requestFingerprint = createSandboxCheckoutRequestFingerprint(
    parsedRequest.items,
    parsedRequest.expectedAmount,
  );
  const ledgerState = await getSandboxCheckoutLedgerState({
    idempotencyKey: parsedRequest.idempotencyKey,
    requestFingerprint,
    userId: sessionResult.session.user.id,
  }).catch(() => null);

  if (!ledgerState) {
    return checkoutErrorResponse(
      CheckoutErrorCode.CheckoutUnavailable,
      "The sandbox checkout is temporarily unavailable.",
      503,
      true,
    );
  }

  if (ledgerState.status === SandboxCheckoutLedgerStatus.Conflict) {
    return checkoutErrorResponse(
      CheckoutErrorCode.InvalidRequest,
      "The sandbox checkout request cannot be reused.",
      409,
      false,
    );
  }

  if (ledgerState.status === SandboxCheckoutLedgerStatus.Unfulfilled) {
    const recoveredCheckout = await fulfillSandboxCheckoutInventory({
      idempotencyKey: parsedRequest.idempotencyKey,
      items: parsedRequest.items,
      requestFingerprint,
      userId: sessionResult.session.user.id,
    }).catch((error: unknown) => {
      console.error(
        "Braintree Sandbox inventory recovery failed:",
        error instanceof Error ? error.message : "Unknown database error.",
      );
      return null;
    });

    if (recoveredCheckout?.status === SandboxCheckoutLedgerStatus.Fulfilled) {
      const recoveryQuote = await getCheckoutQuote(parsedRequest.items).catch(
        () => null,
      );

      if (recoveryQuote?.success) {
        await persistCheckoutOrder({
          idempotencyKey: parsedRequest.idempotencyKey,
          userId: sessionResult.session.user.id,
          checkoutDetails: parsedRequest.checkoutDetails,
          itemSnapshots: recoveryQuote.items,
          transaction: recoveredCheckout.transaction,
        }).catch((error: unknown) => {
          console.error(
            "Sandbox checkout order persistence failed during recovery:",
            error instanceof Error ? error.message : "Unknown database error.",
          );
        });
      }

      revalidateItemsCatalog();
      return checkoutSuccessResponse(recoveredCheckout.transaction);
    }

    return checkoutErrorResponse(
      CheckoutErrorCode.PaymentStatusUnknown,
      "The sandbox transaction was recorded, but inventory fulfillment could not be confirmed.",
      502,
      false,
    );
  }

  if (ledgerState.status === SandboxCheckoutLedgerStatus.Fulfilled) {
    const replayQuote = await getCheckoutQuote(parsedRequest.items).catch(
      () => null,
    );

    if (replayQuote?.success) {
      await persistCheckoutOrder({
        idempotencyKey: parsedRequest.idempotencyKey,
        userId: sessionResult.session.user.id,
        checkoutDetails: parsedRequest.checkoutDetails,
        itemSnapshots: replayQuote.items,
        transaction: ledgerState.transaction,
      }).catch((error: unknown) => {
        console.error(
          "Sandbox checkout order persistence failed during replay:",
          error instanceof Error ? error.message : "Unknown database error.",
        );
      });
    }

    revalidateItemsCatalog();
    return checkoutSuccessResponse(ledgerState.transaction);
  }

  const quote = await getCheckoutQuote(parsedRequest.items).catch(() => null);

  if (!quote) {
    return checkoutErrorResponse(
      CheckoutErrorCode.CheckoutUnavailable,
      "The sandbox checkout is temporarily unavailable.",
      503,
      true,
    );
  }

  if (!quote.success || quote.amount !== parsedRequest.expectedAmount) {
    return checkoutErrorResponse(
      CheckoutErrorCode.BasketChanged,
      "An item price or stock level changed. Return to your basket and re-add the affected items before trying again.",
      409,
      true,
    );
  }

  const configuration = getConfiguredSandboxGateway();

  if (!configuration) {
    return checkoutErrorResponse(
      CheckoutErrorCode.SandboxNotConfigured,
      "Braintree Sandbox is not configured.",
      503,
      false,
    );
  }

  const transactionRequest: SandboxTransactionRequest = {
    amount: quote.amount,
    apiRequestKey: parsedRequest.idempotencyKey,
    orderId: `${SANDBOX_ORDER_ID_PREFIX}${parsedRequest.idempotencyKey}`,
    paymentMethodNonce: parsedRequest.paymentMethodNonce,
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
      return checkoutErrorResponse(
        CheckoutErrorCode.PaymentNotApproved,
        "Braintree Sandbox did not approve the transaction. Review its test amount and card conditions before trying again.",
        422,
        true,
      );
    }

    const transaction = {
      id: result.transaction.id,
      status: result.transaction.status,
      amount: result.transaction.amount,
      currency: result.transaction.currencyIsoCode,
    };
    const fulfilledCheckout = await recordSuccessfulSandboxCheckout({
      idempotencyKey: parsedRequest.idempotencyKey,
      items: parsedRequest.items,
      requestFingerprint,
      transaction,
      userId: sessionResult.session.user.id,
      checkoutDetails: parsedRequest.checkoutDetails,
      itemSnapshots: quote.items,
    }).catch((error: unknown) => {
      console.error(
        "Braintree Sandbox approved transaction fulfillment failed:",
        error instanceof Error ? error.message : "Unknown database error.",
      );
      return null;
    });

    if (
      !fulfilledCheckout ||
      fulfilledCheckout.status !== SandboxCheckoutLedgerStatus.Fulfilled
    ) {
      return checkoutErrorResponse(
        CheckoutErrorCode.PaymentStatusUnknown,
        "The sandbox transaction was approved, but inventory fulfillment could not be confirmed. Check the Braintree Sandbox Control Panel before trying again.",
        502,
        false,
      );
    }

    revalidateItemsCatalog();
    return checkoutSuccessResponse(fulfilledCheckout.transaction);
  } catch {
    return checkoutErrorResponse(
      CheckoutErrorCode.PaymentStatusUnknown,
      "The sandbox result could not be confirmed. Check the Braintree Sandbox Control Panel before trying again.",
      502,
      false,
    );
  }
}
