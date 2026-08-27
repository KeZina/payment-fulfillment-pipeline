import "client-only";

import {
  ApplyCheckoutResponseKind,
  CHECKOUT_FORM_COPY,
  CheckoutErrorCode,
  CheckoutPaymentFeedbackKind,
  SandboxAttemptStatus,
} from "@/constants";
import type { BasketItem } from "@/types";
import type {
  ApplyCheckoutResponseParams,
  ApplyCheckoutResponseResult,
  BuildCheckoutRequestBodyParams,
} from "@/app/user/checkout/_components/checkout-form/checkout-form.types";
import type { CheckoutPaymentFeedback } from "@/app/user/checkout/_components/checkout-payment";
import {
  clearStoredAttempt,
  createBasketFingerprint,
  readStoredAttempt,
  storeAttempt,
} from "./checkout-sandbox-attempt-storage";

export function getStoredAttemptFeedback(
  userId: string,
  basketFingerprint: string,
): CheckoutPaymentFeedback {
  const attempt = readStoredAttempt(userId, basketFingerprint);

  if (!attempt) {
    return null;
  }

  if (attempt.status === SandboxAttemptStatus.Success) {
    return {
      kind: CheckoutPaymentFeedbackKind.Success,
      transactionId: attempt.transaction.id,
      status: attempt.transaction.status,
      amount: attempt.transaction.amount,
      currency: attempt.transaction.currency,
    };
  }

  if (attempt.status === SandboxAttemptStatus.Pending) {
    return null;
  }

  return {
    kind: CheckoutPaymentFeedbackKind.Unknown,
    message: CHECKOUT_FORM_COPY.unknownStatus,
  };
}

export function buildExpectedCheckoutAmount(items: BasketItem[]) {
  return items
    .reduce(
      (total, item) => total + Number(item.salePrice) * item.quantity,
      0,
    )
    .toFixed(2);
}

export function buildCheckoutRequestBody({
  checkoutDetails,
  idempotencyKey,
  items,
  paymentMethodNonce,
}: BuildCheckoutRequestBodyParams) {
  return {
    items: items.map(({ id, quantity }) => ({ id, quantity })),
    checkoutDetails,
    expectedAmount: buildExpectedCheckoutAmount(items),
    paymentMethodNonce,
    idempotencyKey,
  };
}

export function applyCheckoutResponse({
  clearBasket,
  clearPaymentFields,
  pendingAttempt,
  response,
  userId,
}: ApplyCheckoutResponseParams): ApplyCheckoutResponseResult {
  if (!response) {
    storeAttempt(userId, {
      ...pendingAttempt,
      status: SandboxAttemptStatus.Unknown,
    });

    return {
      kind: ApplyCheckoutResponseKind.Feedback,
      feedback: {
        kind: CheckoutPaymentFeedbackKind.Unknown,
        message: CHECKOUT_FORM_COPY.unknownStatus,
      },
    };
  }

  if (response.success) {
    clearStoredAttempt(userId);
    clearPaymentFields();
    clearBasket();
    return { kind: ApplyCheckoutResponseKind.Redirect };
  }

  if (response.code === CheckoutErrorCode.PaymentStatusUnknown) {
    storeAttempt(userId, {
      ...pendingAttempt,
      status: SandboxAttemptStatus.Unknown,
    });

    return {
      kind: ApplyCheckoutResponseKind.Feedback,
      feedback: {
        kind: CheckoutPaymentFeedbackKind.Unknown,
        message: response.message,
      },
    };
  }

  clearStoredAttempt(userId);
  clearPaymentFields();

  return {
    kind: ApplyCheckoutResponseKind.Feedback,
    feedback: {
      kind: CheckoutPaymentFeedbackKind.Error,
      message: response.message,
    },
  };
}

export function createPendingCheckoutAttempt(
  items: BasketItem[],
  idempotencyKey: string,
) {
  return {
    version: 1 as const,
    basketFingerprint: createBasketFingerprint(items),
    idempotencyKey,
    status: SandboxAttemptStatus.Pending,
  };
}

export function getExistingAttemptFeedback(
  userId: string,
  basketFingerprint: string,
): CheckoutPaymentFeedback | null {
  const existingAttempt = readStoredAttempt(userId, basketFingerprint);

  if (!existingAttempt) {
    return null;
  }

  if (existingAttempt.status === SandboxAttemptStatus.Success) {
    return {
      kind: CheckoutPaymentFeedbackKind.Success,
      transactionId: existingAttempt.transaction.id,
      status: existingAttempt.transaction.status,
      amount: existingAttempt.transaction.amount,
      currency: existingAttempt.transaction.currency,
    };
  }

  if (
    existingAttempt.status === SandboxAttemptStatus.Pending ||
    existingAttempt.status === SandboxAttemptStatus.Unknown
  ) {
    return {
      kind: CheckoutPaymentFeedbackKind.Unknown,
      message: CHECKOUT_FORM_COPY.unknownStatus,
    };
  }

  return null;
}
