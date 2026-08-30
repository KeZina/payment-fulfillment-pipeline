"use client";

import { useForm } from "@tanstack/react-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckoutDetailsSchema } from "@/schemas";
import { checkIfFormFieldInvalid } from "@/utils/client";
import { checkoutDetailsFormStyles } from "./checkout-details-form.styles";
import type { CheckoutDetailsFormProps } from "./checkout-details-form.types";

export const CHECKOUT_DETAILS_FORM_ID = "checkout-details-form";

export function CheckoutDetailsForm({
  isDisabled,
  onSubmit,
}: CheckoutDetailsFormProps) {
  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      deliveryAddress: "",
      deliveryInstructions: "",
    },
    validators: {
      onBlur: CheckoutDetailsSchema,
      onSubmit: CheckoutDetailsSchema,
    },
    onSubmit: async ({ value }) => onSubmit(value),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle role='heading' aria-level={2}>
          Delivery details
        </CardTitle>
        <CardDescription>
          Tell us where the order should go. All fields are required except
          delivery instructions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id={CHECKOUT_DETAILS_FORM_ID}
          className={checkoutDetailsFormStyles.form}
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
        >
          <FieldGroup>
            <FieldSet data-disabled={isDisabled} disabled={isDisabled}>
              <FieldLegend>Contact</FieldLegend>
              <FieldDescription>
                Used only for updates about this order.
              </FieldDescription>
              <FieldGroup className={checkoutDetailsFormStyles.fields}>
                <form.Field name='fullName'>
                  {(field) => {
                    const isInvalid = checkIfFormFieldInvalid(field);
                    const errorId = `${field.name}-error`;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={isInvalid}
                          aria-describedby={isInvalid ? errorId : undefined}
                          autoComplete='name'
                          maxLength={120}
                          placeholder='Your full name'
                          required
                        />
                        {isInvalid && (
                          <FieldError
                            id={errorId}
                            errors={field.state.meta.errors}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name='email'>
                  {(field) => {
                    const isInvalid = checkIfFormFieldInvalid(field);
                    const errorId = `${field.name}-error`;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type='email'
                          inputMode='email'
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={isInvalid}
                          aria-describedby={isInvalid ? errorId : undefined}
                          autoComplete='email'
                          maxLength={254}
                          placeholder='you@example.com'
                          required
                        />
                        {isInvalid && (
                          <FieldError
                            id={errorId}
                            errors={field.state.meta.errors}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name='phone'>
                  {(field) => {
                    const isInvalid = checkIfFormFieldInvalid(field);
                    const errorId = `${field.name}-error`;

                    return (
                      <Field
                        className={checkoutDetailsFormStyles.fullWidth}
                        data-invalid={isInvalid}
                      >
                        <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type='tel'
                          inputMode='tel'
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={isInvalid}
                          aria-describedby={isInvalid ? errorId : undefined}
                          autoComplete='tel'
                          maxLength={30}
                          placeholder='+84 90 123 4567'
                          required
                        />
                        {isInvalid && (
                          <FieldError
                            id={errorId}
                            errors={field.state.meta.errors}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>
            </FieldSet>

            <FieldSet data-disabled={isDisabled} disabled={isDisabled}>
              <FieldLegend>Delivery</FieldLegend>
              <FieldGroup className={checkoutDetailsFormStyles.fields}>
                <form.Field name='deliveryAddress'>
                  {(field) => {
                    const isInvalid = checkIfFormFieldInvalid(field);
                    const errorId = `${field.name}-error`;

                    return (
                      <Field
                        className={checkoutDetailsFormStyles.fullWidth}
                        data-invalid={isInvalid}
                      >
                        <FieldLabel htmlFor={field.name}>
                          Delivery address
                        </FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          className={checkoutDetailsFormStyles.address}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={isInvalid}
                          aria-describedby={isInvalid ? errorId : undefined}
                          autoComplete='street-address'
                          maxLength={300}
                          placeholder='Street, building, district, city, and any access details'
                          required
                        />
                        {isInvalid && (
                          <FieldError
                            id={errorId}
                            errors={field.state.meta.errors}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name='deliveryInstructions'>
                  {(field) => {
                    const isInvalid = checkIfFormFieldInvalid(field);
                    const errorId = `${field.name}-error`;

                    return (
                      <Field
                        className={checkoutDetailsFormStyles.fullWidth}
                        data-invalid={isInvalid}
                      >
                        <FieldLabel htmlFor={field.name}>
                          Delivery instructions (optional)
                        </FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          className={checkoutDetailsFormStyles.instructions}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={isInvalid}
                          aria-describedby={isInvalid ? errorId : undefined}
                          autoComplete='off'
                          maxLength={500}
                          placeholder='Gate code, landmark, or handoff preference'
                        />
                        {isInvalid && (
                          <FieldError
                            id={errorId}
                            errors={field.state.meta.errors}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className={checkoutDetailsFormStyles.footer}>
        Demo orders, including the delivery details above, are stored for 30
        days and then deleted. Use fictional contact details — do not enter
        real personal information.
      </CardFooter>
    </Card>
  );
}
