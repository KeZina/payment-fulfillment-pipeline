"use client";

import { useForm, useSelector } from "@tanstack/react-form";
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
  FieldSet,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signUp } from "@/app/actions/auth";
import { checkIfFormFieldInvalid } from "@/utils/client";
import Link from "next/link";
import { toast } from "sonner";
import { SignUpSchema } from "@/schemas";

export function SignUpForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: SignUpSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await signUp(value);

      if (!res.success) {
        toast.error(res.error);
      }
    },
  });

  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting);

  return (
    <Card className='w-full sm:max-w-md'>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Already have an account?{" "}
          <Link className='text-black hover:underline' href='/sign-in'>
            Sign In
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id='sign-up-form'
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <FieldSet data-disabled={isSubmitting} disabled={isSubmitting}>
              <form.Field name='email'>
                {(field) => (
                  <Field data-invalid={checkIfFormFieldInvalid(field)}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={checkIfFormFieldInvalid(field)}
                      placeholder='qwerty@qwerty.qwerty'
                      autoComplete='off`'
                    />
                    {checkIfFormFieldInvalid(field) && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )}
              </form.Field>
              <form.Field name='name'>
                {(field) => (
                  <Field data-invalid={checkIfFormFieldInvalid(field)}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={checkIfFormFieldInvalid(field)}
                      placeholder='Your name'
                      autoComplete='off'
                    />
                    {checkIfFormFieldInvalid(field) && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )}
              </form.Field>
              <form.Field name='password'>
                {(field) => (
                  <Field data-invalid={checkIfFormFieldInvalid(field)}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={checkIfFormFieldInvalid(field)}
                      placeholder='Your password'
                      autoComplete='off`'
                    />
                    {checkIfFormFieldInvalid(field) && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )}
              </form.Field>
            </FieldSet>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation='horizontal'>
          <Button
            type='button'
            variant='outline'
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            <Link href='/'>Go back to the Store</Link>
          </Button>
          <Button type='submit' form='sign-up-form' disabled={isSubmitting}>
            Sign Up
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
