import type braintree from "braintree";

export type BraintreeSandboxTransactionRequest =
  braintree.TransactionRequest & {
    apiRequestKey: string;
  };
