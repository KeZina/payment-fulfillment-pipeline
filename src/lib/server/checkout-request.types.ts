import type { CheckoutErrorCodeValue } from "@/constants";
import type { CheckoutRequest } from "@/types";

export type CheckoutErrorResponseBody = {
  success: false;
  sandbox: true;
  code: CheckoutErrorCodeValue;
  message: string;
  retryable: boolean;
};

export type ParseCheckoutRequestResult =
  | { ok: true; data: CheckoutRequest }
  | { ok: false; response: Response };
