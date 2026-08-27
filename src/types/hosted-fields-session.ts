import type { Client } from "braintree-web/client";
import type { HostedFields } from "braintree-web/hosted-fields";

export type HostedFieldsSessionState = {
  client: Client | null;
  hostedFields: HostedFields | null;
  tornDown: boolean;
};

export type CheckoutHostedFieldsOptions = Parameters<
  typeof import("braintree-web/hosted-fields").create
>[0] & { preventAutofill: boolean };
