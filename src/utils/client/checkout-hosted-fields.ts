import type { HostedFields } from "braintree-web/hosted-fields";
import {
  CHECKOUT_PAYMENT_NUMBER_FIELD_CLASS,
  PAYMENT_FIELD_ERROR_MESSAGES,
  PAYMENT_FIELD_NAMES,
} from "@/constants";

type CheckoutPaymentFieldName = (typeof PAYMENT_FIELD_NAMES)[number];

export function setHostedFieldsDisabledState(
  instance: HostedFields,
  isDisabled: boolean,
) {
  for (const fieldName of PAYMENT_FIELD_NAMES) {
    if (isDisabled) {
      instance.setAttribute(
        {
          field: fieldName,
          attribute: "disabled",
          value: true,
        },
        () => undefined,
      );
      continue;
    }

    instance.removeAttribute(
      {
        field: fieldName,
        attribute: "disabled",
      },
      () => undefined,
    );
  }
}

export function clearHostedFields(
  instance: HostedFields,
  touchedFields: Set<CheckoutPaymentFieldName>,
) {
  touchedFields.clear();

  for (const fieldName of PAYMENT_FIELD_NAMES) {
    try {
      instance.clear(fieldName, () => undefined);
      instance.setAttribute(
        {
          field: fieldName,
          attribute: "aria-invalid",
          value: false,
        },
        () => undefined,
      );
      instance.setMessage({ field: fieldName, message: "" });
    } catch {
      // Clearing is best effort after a completed or rejected sandbox test.
    }
  }
}

export function getInvalidHostedFieldNames(
  state: NonNullable<ReturnType<HostedFields["getState"]>>,
  touchedFields: Set<CheckoutPaymentFieldName>,
  showAllErrors = false,
) {
  return PAYMENT_FIELD_NAMES.filter((fieldName) => {
    const field = state.fields[fieldName];

    return (
      !field.isValid &&
      (showAllErrors ||
        touchedFields.has(fieldName) ||
        !field.isPotentiallyValid)
    );
  });
}

export function syncHostedFieldValidationMessages(
  instance: HostedFields,
  invalidFieldNames: CheckoutPaymentFieldName[],
) {
  for (const fieldName of PAYMENT_FIELD_NAMES) {
    const isInvalid = invalidFieldNames.includes(fieldName);

    try {
      instance.setAttribute(
        {
          field: fieldName,
          attribute: "aria-invalid",
          value: isInvalid,
        },
        () => undefined,
      );
      instance.setMessage({
        field: fieldName,
        message: isInvalid ? PAYMENT_FIELD_ERROR_MESSAGES[fieldName] : "",
      });
    } catch {
      // Visible field errors remain available if iframe messaging fails.
    }
  }
}

export function areAllHostedFieldsValid(
  state: NonNullable<ReturnType<HostedFields["getState"]>>,
) {
  return PAYMENT_FIELD_NAMES.every(
    (fieldName) => state.fields[fieldName].isValid,
  );
}

export function getHostedFieldSlotClassName(isNumberField: boolean) {
  return isNumberField ? CHECKOUT_PAYMENT_NUMBER_FIELD_CLASS : undefined;
}
