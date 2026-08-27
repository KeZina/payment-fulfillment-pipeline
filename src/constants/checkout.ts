export const CheckoutPaymentFeedbackKind = {
  Success: "success",
  Error: "error",
  Unknown: "unknown",
} as const;

export type CheckoutPaymentFeedbackKindValue =
  (typeof CheckoutPaymentFeedbackKind)[keyof typeof CheckoutPaymentFeedbackKind];

export const SandboxAttemptStatus = {
  Pending: "pending",
  Unknown: "unknown",
  Success: "success",
} as const;

export type SandboxAttemptStatusValue =
  (typeof SandboxAttemptStatus)[keyof typeof SandboxAttemptStatus];

export const SandboxCheckoutLedgerStatus = {
  Missing: "missing",
  Conflict: "conflict",
  Unfulfilled: "unfulfilled",
  Fulfilled: "fulfilled",
} as const;

export type SandboxCheckoutLedgerStatusValue =
  (typeof SandboxCheckoutLedgerStatus)[keyof typeof SandboxCheckoutLedgerStatus];

export const CheckoutPaymentInitializationState = {
  Loading: "loading",
  Ready: "ready",
  Error: "error",
} as const;

export type CheckoutPaymentInitializationStateValue =
  (typeof CheckoutPaymentInitializationState)[keyof typeof CheckoutPaymentInitializationState];

export const ApplyCheckoutResponseKind = {
  Redirect: "redirect",
  Feedback: "feedback",
} as const;

export type ApplyCheckoutResponseKindValue =
  (typeof ApplyCheckoutResponseKind)[keyof typeof ApplyCheckoutResponseKind];
