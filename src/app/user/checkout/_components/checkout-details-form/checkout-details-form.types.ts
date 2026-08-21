import type { CheckoutDetails } from "@/types";

export type CheckoutDetailsFormProps = {
  isDisabled: boolean;
  onSubmit: (details: CheckoutDetails) => Promise<void>;
};
