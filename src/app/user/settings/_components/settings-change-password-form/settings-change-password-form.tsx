"use client";

import { useForm, useSelector } from "@tanstack/react-form";
import { toast } from "sonner";
import { changePassword } from "@/app/actions/account";
import { Button } from "@/components/ui/button";
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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ChangePasswordSchema } from "@/schemas";
import { checkIfFormFieldInvalid } from "@/utils/client";
import { settingsChangePasswordFormStyles } from "./settings-change-password-form.styles";

export const SETTINGS_CHANGE_PASSWORD_FORM_ID = "settings-change-password-form";

export function SettingsChangePasswordForm() {
  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onBlur: ChangePasswordSchema,
      onSubmit: ChangePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await changePassword(value);

      if (!res.success) {
        toast.error(res.error);
        return;
      }

      toast.success(res.message ?? "Password updated");
      form.reset();
    },
  });

  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting);

  return (
    <Card>
      <CardHeader>
        <CardTitle role='heading' aria-level={2}>
          Password
        </CardTitle>
        <CardDescription>
          Choose a new password for your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id={SETTINGS_CHANGE_PASSWORD_FORM_ID}
          className={settingsChangePasswordFormStyles.form}
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
        >
          <FieldGroup>
            <FieldSet data-disabled={isSubmitting} disabled={isSubmitting}>
              <FieldGroup className={settingsChangePasswordFormStyles.fields}>
                <form.Field name='currentPassword'>
                  {(field) => {
                    const isInvalid = checkIfFormFieldInvalid(field);
                    const errorId = `${field.name}-error`;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Current password
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type='password'
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={isInvalid}
                          aria-describedby={isInvalid ? errorId : undefined}
                          autoComplete='current-password'
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

                <form.Field name='newPassword'>
                  {(field) => {
                    const isInvalid = checkIfFormFieldInvalid(field);
                    const errorId = `${field.name}-error`;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type='password'
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={isInvalid}
                          aria-describedby={isInvalid ? errorId : undefined}
                          autoComplete='new-password'
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

                <form.Field name='confirmPassword'>
                  {(field) => {
                    const isInvalid = checkIfFormFieldInvalid(field);
                    const errorId = `${field.name}-error`;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Confirm new password
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type='password'
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={isInvalid}
                          aria-describedby={isInvalid ? errorId : undefined}
                          autoComplete='new-password'
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
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className={settingsChangePasswordFormStyles.footer}>
        <Button
          type='submit'
          form={SETTINGS_CHANGE_PASSWORD_FORM_ID}
          disabled={isSubmitting}
        >
          Update password
        </Button>
      </CardFooter>
    </Card>
  );
}
