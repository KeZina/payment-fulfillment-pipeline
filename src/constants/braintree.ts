export const POST_CHECKOUT_REQUEST = "/api/braintree/checkout";
export const POST_CLIENT_TOKEN_REQUEST = "/api/braintree/client-token";

export const CHECKOUT_REQUEST_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
} as const;

export const CHECKOUT_REQUEST_INIT = {
  method: "POST" as const,
  cache: "no-store" as const,
  credentials: "same-origin" as const,
};

export const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  Vary: "Cookie",
} as const;

export const MAX_CHECKOUT_REQUEST_BYTES = 16_384;

export const SANDBOX_ENVIRONMENT = "Sandbox";

export const SANDBOX_ORDER_ID_PREFIX = "sandbox-";

export const CheckoutErrorCode = {
  InvalidRequest: "INVALID_REQUEST",
  Unauthorized: "UNAUTHORIZED",
  InvalidOrigin: "INVALID_ORIGIN",
  BasketChanged: "BASKET_CHANGED",
  CheckoutUnavailable: "CHECKOUT_UNAVAILABLE",
  PaymentNotApproved: "PAYMENT_NOT_APPROVED",
  PaymentStatusUnknown: "PAYMENT_STATUS_UNKNOWN",
  SandboxNotConfigured: "SANDBOX_NOT_CONFIGURED",
} as const;

export type CheckoutErrorCodeValue =
  (typeof CheckoutErrorCode)[keyof typeof CheckoutErrorCode];

export const CHECKOUT_ERROR_CODES = Object.values(
  CheckoutErrorCode,
) as [CheckoutErrorCodeValue, ...CheckoutErrorCodeValue[]];
