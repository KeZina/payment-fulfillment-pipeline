import type {
  BasketItem,
  CheckoutDetails,
  CheckoutResponse,
  SandboxAttempt,
} from "@/types";
import { ApplyCheckoutResponseKind } from "@/constants";
import type { CheckoutPaymentFeedback } from "../checkout-payment";

export type CheckoutFormProps = {
  items: BasketItem[];
};

export type CheckoutFeedbackState = {
  basketFingerprint: string;
  feedback: CheckoutPaymentFeedback;
};

export type BuildCheckoutRequestBodyParams = {
  checkoutDetails: CheckoutDetails;
  idempotencyKey: string;
  items: BasketItem[];
  paymentMethodNonce: string;
};

export type SubmitCheckoutRequestParams = BuildCheckoutRequestBodyParams;

export type ApplyCheckoutResponseParams = {
  clearPaymentFields: () => void;
  pendingAttempt: SandboxAttempt;
  response: CheckoutResponse | null;
  userId: string;
};

export type ApplyCheckoutResponseResult =
  | { kind: typeof ApplyCheckoutResponseKind.Redirect; href: string }
  | {
      kind: typeof ApplyCheckoutResponseKind.Feedback;
      feedback: CheckoutPaymentFeedback;
    };
