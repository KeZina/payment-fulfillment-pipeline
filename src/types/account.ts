import {
  ChangePasswordSchema,
  DeleteAccountSchema,
  UpdateProfileSchema,
} from "@/schemas/account";
import * as v from "valibot";

export type UpdateProfileInput = v.InferInput<typeof UpdateProfileSchema>;
export type ChangePasswordInput = v.InferInput<typeof ChangePasswordSchema>;
export type DeleteAccountInput = v.InferInput<typeof DeleteAccountSchema>;
