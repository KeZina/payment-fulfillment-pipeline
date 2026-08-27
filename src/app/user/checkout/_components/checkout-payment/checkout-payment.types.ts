import type { CheckoutPaymentInitializationStateValue } from "@/constants";
import { CheckoutPaymentFeedbackKind } from "@/constants";
import type { GetCheckoutPaymentButtonLabelParams } from "@/constants/checkout-payment";

export type { GetCheckoutPaymentButtonLabelParams };

export type { CheckoutHostedFieldsOptions } from "@/types/hosted-fields-session";

export type CheckoutPaymentFieldName =
  | "number"
  | "expirationDate"
  | "cvv"
  | "postalCode";

export type CheckoutPaymentInitializationState =
  CheckoutPaymentInitializationStateValue;

export type CheckoutPaymentFeedback =
  | {
      kind: typeof CheckoutPaymentFeedbackKind.Success;
      transactionId: string;
      status: string;
      amount: string;
      currency: string;
    }
  | { kind: typeof CheckoutPaymentFeedbackKind.Error; message: string }
  | { kind: typeof CheckoutPaymentFeedbackKind.Unknown; message: string }
  | null;

export type CheckoutPaymentHandle = {
  tokenize: () => Promise<string>;
  clear: () => void;
};

export type CheckoutPaymentProps = {
  feedback: CheckoutPaymentFeedback;
  formId: string;
  isLocked: boolean;
  isPaymentValid: boolean;
  isSubmitting: boolean;
  onReadyChange: (isReady: boolean) => void;
  onResetAttempt: () => void;
  onValidityChange: (isValid: boolean) => void;
};
