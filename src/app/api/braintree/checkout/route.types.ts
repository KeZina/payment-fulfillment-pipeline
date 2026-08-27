import type braintree from "braintree";

export type SandboxTransactionRequest = braintree.TransactionRequest & {
  apiRequestKey: string;
};
