import {
  CARD_NUMBER_ERROR_ID,
  CARD_NUMBER_FIELD_ID,
  CVV_ERROR_ID,
  CVV_FIELD_ID,
  EXPIRATION_DATE_ERROR_ID,
  EXPIRATION_DATE_FIELD_ID,
  POSTAL_CODE_ERROR_ID,
  POSTAL_CODE_FIELD_ID,
} from "./field-ids";

export const HOSTED_FIELD_DEFINITIONS = [
  {
    fieldName: "number",
    fieldId: CARD_NUMBER_FIELD_ID,
    errorId: CARD_NUMBER_ERROR_ID,
    label: "Card number",
    placeholder: "Card number",
    description: "Use a Braintree Sandbox test card only.",
    isNumberField: true,
  },
  {
    fieldName: "expirationDate",
    fieldId: EXPIRATION_DATE_FIELD_ID,
    errorId: EXPIRATION_DATE_ERROR_ID,
    label: "Expiration date",
    placeholder: "MM / YY",
    description: undefined,
    isNumberField: false,
  },
  {
    fieldName: "cvv",
    fieldId: CVV_FIELD_ID,
    errorId: CVV_ERROR_ID,
    label: "CVV",
    placeholder: "CVV",
    description: undefined,
    isNumberField: false,
  },
  {
    fieldName: "postalCode",
    fieldId: POSTAL_CODE_FIELD_ID,
    errorId: POSTAL_CODE_ERROR_ID,
    label: "Postal code",
    placeholder: "Postal code",
    description: undefined,
    isNumberField: false,
  },
] as const;
