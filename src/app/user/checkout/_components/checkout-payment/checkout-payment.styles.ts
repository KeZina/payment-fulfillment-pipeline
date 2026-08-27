import { CHECKOUT_PAYMENT_NUMBER_FIELD_CLASS } from "@/constants";

export const checkoutPaymentStyles = {
  content: "flex flex-col gap-5",
  status: "text-sm leading-6 text-muted-foreground",
  error: "text-sm leading-6 text-destructive",
  retry: "w-fit",
  fields: "grid gap-5 sm:grid-cols-2",
  fieldsLoading: "pointer-events-none opacity-0",
  numberField: CHECKOUT_PAYMENT_NUMBER_FIELD_CLASS,
  hostedField:
    "h-9 w-full min-w-0 rounded-4xl border border-input bg-input/30 px-3 transition-colors outline-none [&>iframe]:h-full! [&>iframe]:w-full! [&.braintree-hosted-fields-focused]:border-ring [&.braintree-hosted-fields-focused]:ring-[3px] [&.braintree-hosted-fields-focused]:ring-ring/50 [&.braintree-hosted-fields-invalid]:border-destructive [&.braintree-hosted-fields-invalid]:ring-[3px] [&.braintree-hosted-fields-invalid]:ring-destructive/20",
  feedback: "flex flex-col items-start gap-2 text-sm leading-6",
  notice:
    "text-xs leading-5 text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-foreground",
  transactionId: "break-all font-mono text-xs text-muted-foreground",
  footer: "flex-col items-stretch gap-2 border-t",
  button: "w-full",
  explanation: "text-center text-xs leading-5 text-muted-foreground",
} as const;
