"use client";

import { useForm, useSelector } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SignInSchema } from "@/schemas";
import { checkIfFormFieldInvalid } from "@/utils/client";
import Link from "next/link";
import { toast } from "sonner";
import { signIn } from "@/app/actions/auth";

export function SignInForm({ callbackUrl }: { callbackUrl?: string }) {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: SignInSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await signIn(value, callbackUrl);

      if (!res.success) {
        toast.error(res.error);
      }
    },
  });

  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting);

  return (
    <Card className='w-full sm:max-w-md'>
      <CardHeader>
        <h1 className='font-heading text-base font-medium'>Sign In</h1>
        <CardDescription>
          Do not have an account?{" "}
          <Link className='text-black hover:underline' href='/sign-up'>
            Sign Up
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id='sign-in-form'
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <FieldSet data-disabled={isSubmitting} disabled={isSubmitting}>
              <form.Field name='email'>
                {(field) => {
                  const errorId = `${field.name}-error`;
                  const isInvalid = checkIfFormFieldInvalid(field);

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        aria-describedby={isInvalid ? errorId : undefined}
                        placeholder='qwerty@qwerty.qwerty'
                        autoComplete='email'
                      />
                      {isInvalid && (
                        <FieldError id={errorId} errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name='password'>
                {(field) => {
                  const errorId = `${field.name}-error`;
                  const isInvalid = checkIfFormFieldInvalid(field);

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type='password'
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        aria-describedby={isInvalid ? errorId : undefined}
                        placeholder='Your password'
                        autoComplete='current-password'
                      />
                      {isInvalid && (
                        <FieldError id={errorId} errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldSet>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation='horizontal'>
          <Button
            nativeButton={false}
            render={<Link href='/' />}
            type='button'
            variant='outline'
            disabled={isSubmitting}
          >
            Go back to the Store
          </Button>
          <Button type='submit' form='sign-in-form' disabled={isSubmitting}>
            Sign In
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
