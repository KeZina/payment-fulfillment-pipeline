import * as v from "valibot";
import { AVATAR_MAX_DATA_URL_LENGTH } from "@/constants/avatar";

const DATA_URL_IMAGE_REGEX =
  /^data:image\/(?:webp|jpeg|jpg|png|gif);base64,[A-Za-z0-9+/=]+$/;

const AvatarImageSchema = v.pipe(
  v.string(),
  v.transform((value) => value.trim()),
  v.union([
    v.literal(""),
    v.pipe(v.string(), v.url("Invalid image URL")),
    v.pipe(
      v.string(),
      v.regex(DATA_URL_IMAGE_REGEX, "Invalid image file"),
      v.maxLength(AVATAR_MAX_DATA_URL_LENGTH, "Image must be 1 MB or smaller"),
    ),
  ]),
);

export const UpdateProfileSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(2, "Name must contain at least 2 symbols"),
  ),
  email: v.pipe(v.string(), v.email("Invalid email")),
  image: AvatarImageSchema,
});

export const ChangePasswordSchema = v.pipe(
  v.object({
    currentPassword: v.pipe(
      v.string(),
      v.minLength(1, "Current password is required"),
    ),
    newPassword: v.pipe(
      v.string(),
      v.minLength(8, "Password must contain at least 8 symbols"),
    ),
    confirmPassword: v.pipe(
      v.string(),
      v.minLength(1, "Please confirm your new password"),
    ),
  }),
  v.forward(
    v.partialCheck(
      [["newPassword"], ["confirmPassword"]],
      (input) => input.newPassword === input.confirmPassword,
      "Passwords do not match",
    ),
    ["confirmPassword"],
  ),
);

export const DeleteAccountSchema = v.object({
  password: v.pipe(v.string(), v.minLength(1, "Password is required")),
});
