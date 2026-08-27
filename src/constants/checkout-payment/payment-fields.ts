export const PAYMENT_FIELD_NAMES = [
  "number",
  "expirationDate",
  "cvv",
  "postalCode",
] as const;

export const PAYMENT_FIELD_ERROR_MESSAGES = {
  number: "Enter a valid Braintree Sandbox card number.",
  expirationDate: "Enter a valid future expiration date.",
  cvv: "Enter a valid CVV.",
  postalCode: "Enter a valid postal code.",
} as const satisfies Record<(typeof PAYMENT_FIELD_NAMES)[number], string>;
