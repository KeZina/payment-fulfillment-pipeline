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
  // result banner alongside the "Processing…" button.
  const feedback = isSubmitting ? null : settledFeedback;

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

    const existingAttemptFeedback = getExistingAttemptFeedback(
      userId,
      basketFingerprint,
    );

    if (existingAttemptFeedback) {
      setCheckoutFeedback(existingAttemptFeedback);
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
    setCheckoutFeedback(null);
    let didStartCheckoutRequest = false;
    const idempotencyKey = crypto.randomUUID();
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

    clearStoredAttempt(userId);
    paymentRef.current?.clear();
    setCheckoutFeedback(null);
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
        onValidityChange={handleValidityChange}
      />
    </>
  );
}
