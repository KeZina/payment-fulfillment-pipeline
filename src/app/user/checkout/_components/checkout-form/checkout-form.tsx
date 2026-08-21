"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as v from "valibot";
import { auth } from "@/lib/client";
import { BraintreeCheckoutResponseSchema } from "@/schemas";
import { useBasketStore } from "@/stores/basket-store";
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
import type { CheckoutFormProps } from "./checkout-form.types";
import {
  clearStoredAttempt,
  createBasketFingerprint,
  getAttemptStorageKey,
  readStoredAttempt,
  storeAttempt,
} from "./checkout-form.storage";

const UNKNOWN_STATUS_MESSAGE =
  "The sandbox result could not be confirmed. Check the Braintree Sandbox Control Panel before trying again.";

// TODO logic has to be more explicit and descriptive, constants ought to be placed into constants folder
export function CheckoutForm({ items }: CheckoutFormProps) {
  const { data: session, isPending: isSessionPending } = auth.useSession();
  const { clearBasket } = useBasketStore();
  const userId = session?.user.id;
  const paymentRef = useRef<CheckoutPaymentHandle>(null);
  const isRequestInFlightRef = useRef(false);
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [isPaymentValid, setIsPaymentValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<CheckoutPaymentFeedback>(null);
  const basketFingerprint = useMemo(
    () => createBasketFingerprint(items),
    [items],
  );

  useEffect(() => {
    if (!userId) {
      setFeedback(
        isSessionPending
          ? null
          : {
              kind: "error",
              message: "Sign in again before using the sandbox checkout.",
            },
      );
      return;
    }

    const attemptUserId = userId;
    const attemptStorageKey = getAttemptStorageKey(attemptUserId);

    function restoreAttempt() {
      const attempt = readStoredAttempt(attemptUserId, basketFingerprint);

      if (!attempt) {
        setFeedback(null);
        return;
      }

      if (attempt.status === "success") {
        setFeedback({
          kind: "success",
          transactionId: attempt.transaction.id,
          status: attempt.transaction.status,
          amount: attempt.transaction.amount,
          currency: attempt.transaction.currency,
        });
        return;
      }

      setFeedback({ kind: "unknown", message: UNKNOWN_STATUS_MESSAGE });
    }

    function handleStorageChange(event: StorageEvent) {
      if (event.key === attemptStorageKey) {
        restoreAttempt();
      }
    }

    restoreAttempt();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [basketFingerprint, isSessionPending, userId]);

  const handleReadyChange = useCallback((isReady: boolean) => {
    setIsPaymentReady(isReady);
  }, []);

  const handleValidityChange = useCallback((isValid: boolean) => {
    setIsPaymentValid(isValid);
  }, []);

  const handleSubmit = useCallback(
    async (checkoutDetails: CheckoutDetails) => {
      if (isRequestInFlightRef.current) {
        return;
      }

      if (!userId) {
        setFeedback({
          kind: "error",
          message: "Sign in again before using the sandbox checkout.",
        });
        return;
      }

      const existingAttempt = readStoredAttempt(userId, basketFingerprint);

      if (existingAttempt) {
        if (existingAttempt.status === "success") {
          setFeedback({
            kind: "success",
            transactionId: existingAttempt.transaction.id,
            status: existingAttempt.transaction.status,
            amount: existingAttempt.transaction.amount,
            currency: existingAttempt.transaction.currency,
          });
        } else {
          setFeedback({ kind: "unknown", message: UNKNOWN_STATUS_MESSAGE });
        }

        return;
      }

      const payment = paymentRef.current;

      if (!payment || !isPaymentReady || !isPaymentValid) {
        setFeedback({
          kind: "error",
          message: "Complete the secure sandbox card fields before submitting.",
        });
        return;
      }

      isRequestInFlightRef.current = true;
      setIsSubmitting(true);
      setFeedback(null);
      let didStartCheckoutRequest = false;
      const idempotencyKey = crypto.randomUUID();
      const pendingAttempt = {
        version: 1,
        basketFingerprint,
        idempotencyKey,
        status: "pending",
      } as const;

      if (!storeAttempt(userId, pendingAttempt)) {
        isRequestInFlightRef.current = false;
        setIsSubmitting(false);
        setFeedback({
          kind: "error",
          message:
            "The browser could not save the sandbox retry guard. Enable local storage before trying again.",
        });
        return;
      }

      try {
        const paymentMethodNonce = await payment.tokenize();
        const expectedAmount = items
          .reduce(
            (total, item) =>
              total + Number(item.salePrice) * item.quantity,
            0,
          )
          .toFixed(2);
        didStartCheckoutRequest = true;

        const response = await fetch("/api/braintree/checkout", {
          method: "POST",
          cache: "no-store",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: items.map(({ id, quantity }) => ({ id, quantity })),
            checkoutDetails,
            expectedAmount,
            paymentMethodNonce,
            idempotencyKey,
          }),
        });

        const responseBody: unknown = await response.json();
        const parsedResponse = v.safeParse(
          BraintreeCheckoutResponseSchema,
          responseBody,
        );

        if (!parsedResponse.success) {
          storeAttempt(userId, { ...pendingAttempt, status: "unknown" });
          setFeedback({ kind: "unknown", message: UNKNOWN_STATUS_MESSAGE });
          return;
        }

        if (parsedResponse.output.success) {
          clearStoredAttempt(userId);
          payment.clear();
          clearBasket();
          window.location.replace("/");
          return;
        }

        if (parsedResponse.output.code === "PAYMENT_STATUS_UNKNOWN") {
          storeAttempt(userId, { ...pendingAttempt, status: "unknown" });
          setFeedback({
            kind: "unknown",
            message: parsedResponse.output.message,
          });
          return;
        }

        clearStoredAttempt(userId);
        payment.clear();
        setFeedback({
          kind: "error",
          message: parsedResponse.output.message,
        });
      } catch {
        if (didStartCheckoutRequest) {
          storeAttempt(userId, { ...pendingAttempt, status: "unknown" });
          setFeedback({ kind: "unknown", message: UNKNOWN_STATUS_MESSAGE });
        } else {
          clearStoredAttempt(userId);
          setFeedback({
            kind: "error",
            message:
              "The sandbox card details could not be secured. Review them and try again.",
          });
        }
      } finally {
        isRequestInFlightRef.current = false;
        setIsSubmitting(false);
      }
    },
    [
      basketFingerprint,
      clearBasket,
      isPaymentReady,
      isPaymentValid,
      items,
      userId,
    ],
  );

  const handleResetAttempt = useCallback(() => {
    if (!userId) {
      return;
    }

    clearStoredAttempt(userId);
    paymentRef.current?.clear();
    setFeedback(null);
  }, [userId]);

  const isLocked =
    isSessionPending ||
    !userId ||
    feedback?.kind === "success" ||
    feedback?.kind === "unknown";

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
