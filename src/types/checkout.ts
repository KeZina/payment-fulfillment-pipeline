import type * as v from "valibot";
import type {
  BraintreeCheckoutRequestSchema,
  BraintreeCheckoutResponseSchema,
  BraintreeClientTokenResponseSchema,
  BraintreeSandboxAttemptSchema,
  CheckoutDetailsSchema,
  CheckoutLineItemSchema,
} from "@/schemas/checkout";

export type CheckoutDetails = v.InferOutput<typeof CheckoutDetailsSchema>;

export type CheckoutLineItem = v.InferOutput<typeof CheckoutLineItemSchema>;

export type BraintreeCheckoutRequest = v.InferOutput<
  typeof BraintreeCheckoutRequestSchema
>;

export type BraintreeClientTokenResponse = v.InferOutput<
  typeof BraintreeClientTokenResponseSchema
>;

export type BraintreeCheckoutResponse = v.InferOutput<
  typeof BraintreeCheckoutResponseSchema
>;

export type BraintreeCheckoutSuccessResponse = Extract<
  BraintreeCheckoutResponse,
  { success: true }
>;

export type BraintreeSandboxAttempt = v.InferOutput<
  typeof BraintreeSandboxAttemptSchema
>;

export type CheckoutQuoteResult =
  | { success: true; amount: string }
  | { success: false };
