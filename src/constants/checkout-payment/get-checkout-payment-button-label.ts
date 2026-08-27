import { CheckoutPaymentFeedbackKind } from "../checkout";
import type { CheckoutPaymentFeedbackKindValue } from "../checkout";
import { CHECKOUT_PAYMENT_COPY } from "./checkout-payment-copy";

export type GetCheckoutPaymentButtonLabelParams = {
  feedbackKind?: CheckoutPaymentFeedbackKindValue | null;
  isPaymentValid: boolean;
  isReady: boolean;
  isSubmitting: boolean;
};

export function getCheckoutPaymentButtonLabel({
  feedbackKind,
  isPaymentValid,
  isReady,
  isSubmitting,
}: GetCheckoutPaymentButtonLabelParams) {
  if (isSubmitting) {
    return CHECKOUT_PAYMENT_COPY.processingTransaction;
  }

  if (feedbackKind === CheckoutPaymentFeedbackKind.Success) {
    return CHECKOUT_PAYMENT_COPY.transactionComplete;
  }

  if (feedbackKind === CheckoutPaymentFeedbackKind.Unknown) {
    return CHECKOUT_PAYMENT_COPY.reviewStatus;
  }

  if (!isReady) {
    return CHECKOUT_PAYMENT_COPY.loadingPaymentFields;
  }

  if (!isPaymentValid) {
    return CHECKOUT_PAYMENT_COPY.enterCardDetails;
  }

  return CHECKOUT_PAYMENT_COPY.submitTransaction;
}
