import useSWRMutation from "swr/mutation";
import { POST_CHECKOUT_REQUEST } from "@/constants";
import { submitCheckoutRequestFetcher } from "@/utils/client/checkout-request";

export function useCheckoutSubmit() {
  const { trigger: submitCheckout } = useSWRMutation(
    POST_CHECKOUT_REQUEST,
    submitCheckoutRequestFetcher,
  );

  return { submitCheckout };
}
