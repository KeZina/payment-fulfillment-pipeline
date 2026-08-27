import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { PAYMENT_FIELD_ERROR_MESSAGES } from "@/constants";
import { checkoutPaymentStyles } from "../checkout-payment.styles";
import type { HostedFieldSlotProps } from "./hosted-field-slot.types";

export function HostedFieldSlot({
  className,
  description,
  errorId,
  fieldId,
  fieldName,
  isDisabled,
  isInvalid,
  label,
}: HostedFieldSlotProps) {
  return (
    <Field
      className={className}
      data-disabled={isDisabled}
      data-invalid={isInvalid}
    >
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <div id={fieldId} className={checkoutPaymentStyles.hostedField} />
      {description ? (
        <FieldDescription>{description}</FieldDescription>
      ) : null}
      {isInvalid ? (
        <FieldError id={errorId}>
          {PAYMENT_FIELD_ERROR_MESSAGES[fieldName]}
        </FieldError>
      ) : null}
    </Field>
  );
}
