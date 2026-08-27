import type { CheckoutPaymentFieldName } from "../checkout-payment.types";

export type HostedFieldSlotProps = {
  className?: string;
  description?: string;
  errorId: string;
  fieldId: string;
  fieldName: CheckoutPaymentFieldName;
  isDisabled: boolean;
  isInvalid: boolean;
  label: string;
};
