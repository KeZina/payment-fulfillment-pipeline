import type * as v from "valibot";
import type {
  CheckoutRequestSchema,
  CheckoutResponseSchema,
  ClientTokenResponseSchema,
  SandboxAttemptSchema,
  CheckoutDetailsSchema,
  CheckoutLineItemSchema,
} from "@/schemas/checkout";

export type CheckoutDetails = v.InferOutput<typeof CheckoutDetailsSchema>;

export type CheckoutLineItem = v.InferOutput<typeof CheckoutLineItemSchema>;

export type CheckoutRequest = v.InferOutput<typeof CheckoutRequestSchema>;

export type ClientTokenResponse = v.InferOutput<
  typeof ClientTokenResponseSchema
>;

export type CheckoutResponse = v.InferOutput<typeof CheckoutResponseSchema>;

export type CheckoutSuccessResponse = Extract<
  CheckoutResponse,
  { success: true }
>;

export type SandboxAttempt = v.InferOutput<typeof SandboxAttemptSchema>;

export type CheckoutQuoteResult =
  | { success: true; amount: string }
  | { success: false };
