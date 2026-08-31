"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { useCheckoutSubmit } from "@/hooks/use-checkout-submit";
import {
  ApplyCheckoutResponseKind,
  CHECKOUT_FORM_COPY,
  CheckoutPaymentFeedbackKind,
  SandboxAttemptStatus,
} from "@/constants";
import { auth } from "@/lib/client";
import type { CheckoutDetails } from "@/types";
import {
  CHECKOUT_DETAILS_FORM_ID,
  CheckoutDetailsForm,
} from "../checkout-details-form";
import {
  CheckoutPayment,
  type CheckoutPaymentFeedback,
  type CheckoutPaymentHandle,
} from "../checkout-payment";
import {
  applyCheckoutResponse,
  clearStoredAttempt,
  createBasketFingerprint,
  createPendingCheckoutAttempt,
  getExistingAttemptFeedback,
  getStoredAttemptFeedback,
  readStoredAttempt,
  storeAttempt,
  subscribeToStoredAttemptChanges,
  subscribeToStoredAttemptStorageEvents,
} from "@/utils/client";
import type {
  CheckoutFeedbackState,
  CheckoutFormProps,
} from "./checkout-form.types";

const SIGN_IN_FEEDBACK: CheckoutPaymentFeedback = {
  kind: CheckoutPaymentFeedbackKind.Error,
  message: CHECKOUT_FORM_COPY.signInRequired,
};

function useStoredAttemptFeedback(
  userId: string | undefined,
  basketFingerprint: string,
) {
  const snapshotCacheRef = useRef<{
    signature: string;
    snapshot: CheckoutPaymentFeedback;
  } | null>(null);

  function getSnapshot() {
    if (!userId) {
      return null;
    }

    const attempt = readStoredAttempt(userId, basketFingerprint);
    const signature = `${userId}:${basketFingerprint}:${
      attempt ? JSON.stringify(attempt) : ""
    }`;
    const cache = snapshotCacheRef.current;

    if (cache?.signature === signature) {
      return cache.snapshot;
    }

    const snapshot = getStoredAttemptFeedback(userId, basketFingerprint);
    snapshotCacheRef.current = { signature, snapshot };

    return snapshot;
  }

  return useSyncExternalStore(
    (onStoreChange) => {
      const unsubscribeLocal = subscribeToStoredAttemptChanges(onStoreChange);
      const unsubscribeStorage = userId
        ? subscribeToStoredAttemptStorageEvents(userId, onStoreChange)
        : () => undefined;

      return () => {
        unsubscribeLocal();
        unsubscribeStorage();
      };
    },
    getSnapshot,
    () => null,
  );
}

export function CheckoutForm({ items }: CheckoutFormProps) {
  const { submitCheckout } = useCheckoutSubmit();
  const { data: session, isPending: isSessionPending } = auth.useSession();
  const userId = session?.user.id;
  const paymentRef = useRef<CheckoutPaymentHandle>(null);
  const isRequestInFlightRef = useRef(false);
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [isPaymentValid, setIsPaymentValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Set when the shopper explicitly asks to retry a stuck "Unknown" attempt.
  // This unlocks the form for exactly one resubmission, which reuses that
  // attempt's idempotency key instead of abandoning it.
  const [isRetryRequested, setIsRetryRequested] = useState(false);
  const [checkoutFeedbackState, setCheckoutFeedbackState] =
    useState<CheckoutFeedbackState | null>(null);
  const basketFingerprint = createBasketFingerprint(items);
  const storedAttemptFeedback = useStoredAttemptFeedback(
    userId,
    basketFingerprint,
  );
  const checkoutFeedback =
    checkoutFeedbackState?.basketFingerprint === basketFingerprint
      ? checkoutFeedbackState.feedback
      : null;
  const sessionFeedback =
    !userId && !isSessionPending ? SIGN_IN_FEEDBACK : null;
  const settledFeedback =
    checkoutFeedback ?? storedAttemptFeedback ?? sessionFeedback;
  // While a submission is in flight, the settled feedback sources (local
  // state, stored attempt, session) can briefly reflect an intermediate or
  // stale value. The loading state is authoritative here: never show a
  // result banner alongside the "Processing…" button. A requested retry is
  // authoritative too: it unlocks the form so the shopper can resubmit the
  // same stuck attempt.
  const feedback = isSubmitting || isRetryRequested ? null : settledFeedback;

  function setCheckoutFeedback(nextFeedback: CheckoutPaymentFeedback) {
    setCheckoutFeedbackState(
      nextFeedback === null
        ? null
        : { basketFingerprint, feedback: nextFeedback },
    );
  }

  function handleReadyChange(isReady: boolean) {
    setIsPaymentReady(isReady);
  }

  function handleValidityChange(isValid: boolean) {
    setIsPaymentValid(isValid);
  }

  async function handleSubmit(checkoutDetails: CheckoutDetails) {
    if (isRequestInFlightRef.current) {
      return;
    }

    if (!userId) {
      setCheckoutFeedback(SIGN_IN_FEEDBACK);
      return;
    }

    const existingAttempt = readStoredAttempt(userId, basketFingerprint);
    // A retry only ever applies to an "Unknown" attempt, and only once: the
    // flag is consumed as soon as this submission proceeds past the guard.
    const isRetryOfUnknownAttempt =
      isRetryRequested &&
      existingAttempt?.status === SandboxAttemptStatus.Unknown;

    if (existingAttempt && !isRetryOfUnknownAttempt) {
      setCheckoutFeedback(
        getExistingAttemptFeedback(userId, basketFingerprint),
      );
      return;
    }

    const payment = paymentRef.current;

    if (!payment || !isPaymentReady || !isPaymentValid) {
      setCheckoutFeedback({
        kind: CheckoutPaymentFeedbackKind.Error,
        message: CHECKOUT_FORM_COPY.completeCardFields,
      });
      return;
    }

    isRequestInFlightRef.current = true;
    setIsSubmitting(true);
    setIsRetryRequested(false);
    setCheckoutFeedback(null);
    let didStartCheckoutRequest = false;
    // Reusing the stuck attempt's idempotency key means the sandbox gateway
    // and the checkout route both settle the same transaction instead of
    // creating a second charge for the same order.
    const idempotencyKey = isRetryOfUnknownAttempt
      ? existingAttempt.idempotencyKey
      : crypto.randomUUID();
    const pendingAttempt = createPendingCheckoutAttempt(items, idempotencyKey);

    if (!storeAttempt(userId, pendingAttempt)) {
      isRequestInFlightRef.current = false;
      setIsSubmitting(false);
      setCheckoutFeedback({
        kind: CheckoutPaymentFeedbackKind.Error,
        message: CHECKOUT_FORM_COPY.retryGuardStorageFailed,
      });
      return;
    }

    try {
      const paymentMethodNonce = await payment.tokenize();
      didStartCheckoutRequest = true;

      const response = await submitCheckout({
        checkoutDetails,
        idempotencyKey,
        items,
        paymentMethodNonce,
      });
      const result = applyCheckoutResponse({
        clearPaymentFields: () => payment.clear(),
        pendingAttempt,
        response,
        userId,
      });

      if (result.kind === ApplyCheckoutResponseKind.Redirect) {
        window.location.replace(result.href);
        return;
      }

      setCheckoutFeedback(result.feedback);
    } catch {
      if (didStartCheckoutRequest) {
        storeAttempt(userId, {
          ...pendingAttempt,
          status: SandboxAttemptStatus.Unknown,
        });
        setCheckoutFeedback({
          kind: CheckoutPaymentFeedbackKind.Unknown,
          message: CHECKOUT_FORM_COPY.unknownStatus,
        });
      } else {
        clearStoredAttempt(userId);
        setCheckoutFeedback({
          kind: CheckoutPaymentFeedbackKind.Error,
          message: CHECKOUT_FORM_COPY.tokenizeFailed,
        });
      }
    } finally {
      isRequestInFlightRef.current = false;
      setIsSubmitting(false);
    }
  }

  function handleResetAttempt() {
    if (!userId) {
      return;
    }

    setIsRetryRequested(false);
    clearStoredAttempt(userId);
    paymentRef.current?.clear();
    setCheckoutFeedback(null);
  }

  function handleRetryAttempt() {
    if (!userId) {
      return;
    }

    setIsRetryRequested(true);
  }

  const isLocked =
    isSessionPending ||
    !userId ||
    feedback?.kind === CheckoutPaymentFeedbackKind.Success ||
    feedback?.kind === CheckoutPaymentFeedbackKind.Unknown;

  return (
    <>
      <CheckoutDetailsForm
        isDisabled={isSubmitting || isLocked}
        onSubmit={handleSubmit}
      />
      <CheckoutPayment
        ref={paymentRef}
        feedback={feedback}
        formId={CHECKOUT_DETAILS_FORM_ID}
        isLocked={isLocked}
        isPaymentValid={isPaymentValid}
        isSubmitting={isSubmitting}
        onReadyChange={handleReadyChange}
        onResetAttempt={handleResetAttempt}
        onRetryAttempt={handleRetryAttempt}
        onValidityChange={handleValidityChange}
      />
    </>
  );
}
