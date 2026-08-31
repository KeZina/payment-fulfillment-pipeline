export const CHECKOUT_PAYMENT_COPY = {
  loadingFields: "Loading secure Braintree fields…",
  initializationError:
    "Braintree Sandbox could not initialize. Check the server configuration and try again.",
  retryFields: "Retry secure fields",
  submitTransaction: "Submit sandbox transaction",
  processingTransaction: "Processing sandbox transaction…",
  transactionComplete: "Sandbox transaction complete",
  reviewStatus: "Review sandbox status",
  loadingPaymentFields: "Loading secure payment fields…",
  enterCardDetails: "Enter sandbox card details",
  sandboxApproved: "Sandbox approved",
  startAnotherTest: "Start another sandbox test",
  retryUnknownAttempt: "Retry this payment",
  resetUnknownAttempt: "I checked — start a new sandbox test",
  footerExplanation:
    "This creates a simulated Sandbox transaction only. No real money can be charged. Use a USD Sandbox merchant account to match the displayed prices.",
} as const;
