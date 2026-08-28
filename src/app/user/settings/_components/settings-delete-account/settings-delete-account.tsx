"use client";

import { useState } from "react";
import { useForm, useSelector } from "@tanstack/react-form";
import { toast } from "sonner";
import { deleteAccount } from "@/app/actions/account";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { DeleteAccountSchema } from "@/schemas";
import { checkIfFormFieldInvalid } from "@/utils/client";
import { settingsDeleteAccountStyles } from "./settings-delete-account.styles";

export function SettingsDeleteAccount() {
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      password: "",
    },
    validators: {
      onBlur: DeleteAccountSchema,
      onSubmit: DeleteAccountSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await deleteAccount(value);

      if (res && !res.success) {
        toast.error(res.error);
      }
    },
  });

  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting);

  return (
    <Card>
      <CardHeader>
        <CardTitle role='heading' aria-level={2}>
          Delete account
        </CardTitle>
        <CardDescription>
          Permanently remove your account, order history, and saved sessions.
          This cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent className={settingsDeleteAccountStyles.content}>
        <AlertDialog
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);

            if (!nextOpen) {
              form.reset();
            }
          }}
        >
          <AlertDialogTrigger render={<Button variant='destructive' />}>
            Delete account
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>
                Your profile, order history, and sandbox checkout records will be
                permanently deleted. Enter your password to confirm.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form
              id='settings-delete-account-form'
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                void form.handleSubmit();
              }}
            >
              <FieldGroup className={settingsDeleteAccountStyles.fields}>
                <FieldSet data-disabled={isSubmitting} disabled={isSubmitting}>
                  <form.Field name='password'>
                    {(field) => {
                      const isInvalid = checkIfFormFieldInvalid(field);
                      const errorId = `${field.name}-error`;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Password</FieldLabel>
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
                </FieldSet>
              </FieldGroup>
            </form>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                type='submit'
                form='settings-delete-account-form'
                variant='destructive'
                disabled={isSubmitting}
              >
                Delete account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
