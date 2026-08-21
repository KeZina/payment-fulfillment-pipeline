export type CheckoutPaymentFieldName =
  | "number"
  | "expirationDate"
  | "cvv"
  | "postalCode";

export type CheckoutHostedFieldsOptions = Parameters<
  typeof import("braintree-web/hosted-fields").create
>[0] & { preventAutofill: boolean };

export type CheckoutPaymentInitializationState =
  | "loading"
  | "ready"
  | "error";

export type CheckoutPaymentFeedback =
  | {
      kind: "success";
      transactionId: string;
      status: string;
      amount: string;
      currency: string;
    }
  | { kind: "error"; message: string }
  | { kind: "unknown"; message: string }
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
