import * as v from "valibot";

export const CheckoutDetailsSchema = v.object({
  fullName: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(2, "Enter your full name"),
    v.maxLength(120, "Name must be 120 characters or fewer"),
  ),
  email: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Enter your email address"),
    v.email("Enter a valid email address"),
    v.maxLength(254, "Email must be 254 characters or fewer"),
  ),
  phone: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(7, "Enter a valid phone number"),
    v.maxLength(30, "Phone number must be 30 characters or fewer"),
    v.regex(
      /^[+0-9()\-.\s]+$/,
      "Phone number can only contain numbers and common phone symbols",
    ),
  ),
  deliveryAddress: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(10, "Enter a complete delivery address"),
    v.maxLength(300, "Address must be 300 characters or fewer"),
  ),
  deliveryInstructions: v.pipe(
    v.string(),
    v.trim(),
    v.maxLength(500, "Instructions must be 500 characters or fewer"),
  ),
});

const PositiveIntegerSchema = v.pipe(
  v.number(),
  v.safeInteger(),
  v.minValue(1),
);

export const CheckoutLineItemSchema = v.strictObject({
  id: PositiveIntegerSchema,
  quantity: v.pipe(PositiveIntegerSchema, v.maxValue(99)),
});

const CheckoutLineItemsSchema = v.pipe(
  v.array(CheckoutLineItemSchema),
  v.minLength(1),
  v.maxLength(50),
  v.check(
    (items) => new Set(items.map(({ id }) => id)).size === items.length,
    "Checkout item IDs must be unique.",
  ),
);

export const BraintreeCheckoutRequestSchema = v.strictObject({
  items: CheckoutLineItemsSchema,
  checkoutDetails: CheckoutDetailsSchema,
  expectedAmount: v.pipe(
    v.string(),
    v.maxLength(20),
    v.regex(/^\d+\.\d{2}$/),
  ),
  paymentMethodNonce: v.pipe(
    v.string(),
    v.nonEmpty(),
    v.maxLength(2048),
  ),
  idempotencyKey: v.pipe(v.string(), v.uuid()),
});

export const BraintreeClientTokenResponseSchema = v.strictObject({
  clientToken: v.pipe(v.string(), v.nonEmpty(), v.maxLength(8192)),
  sandbox: v.literal(true),
});

const BraintreeTransactionSchema = v.strictObject({
  id: v.pipe(v.string(), v.nonEmpty(), v.maxLength(128)),
  status: v.pipe(v.string(), v.nonEmpty(), v.maxLength(64)),
  amount: v.pipe(v.string(), v.regex(/^\d+\.\d{2}$/)),
  currency: v.pipe(v.string(), v.regex(/^[A-Z]{3}$/)),
});

const BraintreeCheckoutSuccessResponseSchema = v.strictObject({
  success: v.literal(true),
  sandbox: v.literal(true),
  transaction: BraintreeTransactionSchema,
});

const BraintreeCheckoutErrorResponseSchema = v.strictObject({
  success: v.literal(false),
  sandbox: v.literal(true),
  code: v.picklist([
    "INVALID_REQUEST",
    "UNAUTHORIZED",
    "INVALID_ORIGIN",
    "BASKET_CHANGED",
    "CHECKOUT_UNAVAILABLE",
    "PAYMENT_NOT_APPROVED",
    "PAYMENT_STATUS_UNKNOWN",
    "SANDBOX_NOT_CONFIGURED",
  ]),
  message: v.pipe(v.string(), v.nonEmpty(), v.maxLength(300)),
  retryable: v.boolean(),
});

export const BraintreeCheckoutResponseSchema = v.variant("success", [
  BraintreeCheckoutSuccessResponseSchema,
  BraintreeCheckoutErrorResponseSchema,
]);

const BraintreeSandboxAttemptBaseEntries = {
  version: v.literal(1),
  basketFingerprint: v.pipe(
    v.string(),
    v.nonEmpty(),
    v.maxLength(4096),
  ),
  idempotencyKey: v.pipe(v.string(), v.uuid()),
};

export const BraintreeSandboxAttemptSchema = v.variant("status", [
  v.strictObject({
    ...BraintreeSandboxAttemptBaseEntries,
    status: v.literal("pending"),
  }),
  v.strictObject({
    ...BraintreeSandboxAttemptBaseEntries,
    status: v.literal("unknown"),
  }),
  v.strictObject({
    ...BraintreeSandboxAttemptBaseEntries,
    status: v.literal("success"),
    transaction: BraintreeTransactionSchema,
  }),
]);
