"use client";

import { useRef } from "react";
import { useForm, useSelector } from "@tanstack/react-form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProfile } from "@/app/actions/account";
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UpdateProfileSchema } from "@/schemas";
import {
  AVATAR_ACCEPT_ATTRIBUTE,
  AVATAR_SETTINGS_PREVIEW_SIZE_PX,
} from "@/constants/avatar";
import { SETTINGS_PROFILE_FORM_ID } from "@/constants/settings";
import {
  checkIfFormFieldInvalid,
  readAvatarFileAsDataUrl,
} from "@/utils/client";
import { settingsProfileFormStyles } from "./settings-profile-form.styles";
import type { SettingsProfileFormProps } from "./settings-profile-form.types";

export function SettingsProfileForm({ defaultValues }: SettingsProfileFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues,
    validators: {
      onBlur: UpdateProfileSchema,
      onSubmit: UpdateProfileSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await updateProfile(value);

      if (!res.success) {
        toast.error(res.error);
        return;
      }

      toast.success(res.message ?? "Profile updated");
      router.refresh();
    },
  });

  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting);

  return (
    <Card>
      <CardHeader>
        <CardTitle role='heading' aria-level={2}>
          Profile
        </CardTitle>
        <CardDescription>
          Update your name, email, and avatar shown on your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id={SETTINGS_PROFILE_FORM_ID}
          className={settingsProfileFormStyles.form}
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
        >
          <FieldGroup>
            <FieldSet data-disabled={isSubmitting} disabled={isSubmitting}>
              <FieldGroup className={settingsProfileFormStyles.fields}>
                <form.Field name='name'>
                  {(field) => {
                    const isInvalid = checkIfFormFieldInvalid(field);
                    const errorId = `${field.name}-error`;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
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
                          placeholder='Your name'
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

                <form.Field name='image'>
                  {(field) => {
                    const isInvalid = checkIfFormFieldInvalid(field);
                    const errorId = `${field.name}-error`;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor='settings-avatar-input'>
                          Avatar
                        </FieldLabel>
                        <FieldDescription>
                          Choose a photo from your computer. JPEG, PNG, WebP, or
                          GIF. Images are cropped, resized, and compressed to 1
                          MB or less automatically.
                        </FieldDescription>
                        <div className={settingsProfileFormStyles.avatarRow}>
                          {field.state.value ? (
                            <Image
                              src={field.state.value}
                              alt='Avatar preview'
                              width={AVATAR_SETTINGS_PREVIEW_SIZE_PX}
                              height={AVATAR_SETTINGS_PREVIEW_SIZE_PX}
                              sizes={`${AVATAR_SETTINGS_PREVIEW_SIZE_PX}px`}
                              unoptimized
                              className={settingsProfileFormStyles.avatarPreview}
                            />
                          ) : (
                            <div
                              className={settingsProfileFormStyles.avatarPlaceholder}
                              aria-hidden='true'
                            >
                              No photo
                            </div>
                          )}
                          <div className={settingsProfileFormStyles.avatarActions}>
                            <input
                              ref={fileInputRef}
                              id='settings-avatar-input'
                              className={settingsProfileFormStyles.hiddenFileInput}
                              type='file'
                              accept={AVATAR_ACCEPT_ATTRIBUTE}
                              aria-invalid={isInvalid}
                              aria-describedby={isInvalid ? errorId : undefined}
                              onChange={async (event) => {
                                const file = event.target.files?.[0];

                                if (!file) {
                                  return;
                                }

                                try {
                                  const dataUrl =
                                    await readAvatarFileAsDataUrl(file);
                                  field.handleChange(dataUrl);
                                  field.handleBlur();
                                } catch (error) {
                                  toast.error(
                                    error instanceof Error
                                      ? error.message
                                      : "Failed to read image",
                                  );
                                } finally {
                                  event.target.value = "";
                                }
                              }}
                            />
                            <div className='flex flex-wrap gap-2'>
                              <Button
                                type='button'
                                variant='outline'
                                disabled={isSubmitting}
                                onClick={() => fileInputRef.current?.click()}
                              >
                                Choose image
                              </Button>
                              {field.state.value ? (
                                <Button
                                  type='button'
                                  variant='ghost'
                                  disabled={isSubmitting}
                                  onClick={() => {
                                    field.handleChange("");
                                    field.handleBlur();

                                    if (fileInputRef.current) {
                                      fileInputRef.current.value = "";
                                    }
                                  }}
                                >
                                  Remove avatar
                                </Button>
                              ) : null}
                            </div>
                            <p className={settingsProfileFormStyles.avatarHint}>
                              Save profile to apply your new avatar.
                            </p>
                          </div>
                        </div>
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
      <CardFooter className={settingsProfileFormStyles.footer}>
        <Button
          type='submit'
          form={SETTINGS_PROFILE_FORM_ID}
          disabled={isSubmitting}
        >
          Save profile
        </Button>
      </CardFooter>
    </Card>
  );
}
