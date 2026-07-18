import { AnyFieldApi } from "@tanstack/react-form";

export function checkIfFormFieldInvalid(field: AnyFieldApi) {
  return field.state.meta.isTouched && !field.state.meta.isValid;
}
