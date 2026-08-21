import type { CheckoutLineItem } from "@/types";

export type SandboxTransactionSnapshot = {
  id: string;
  status: string;
  amount: string;
  currency: string;
};

export type SandboxCheckoutLedgerState =
  | { status: "missing" }
  | { status: "conflict" }
  | { status: "unfulfilled" }
  | {
      status: "fulfilled";
      transaction: SandboxTransactionSnapshot;
    };

export type GetSandboxCheckoutLedgerStateParams = {
  idempotencyKey: string;
  requestFingerprint: string;
  userId: string;
};

export type FulfillSandboxCheckoutInventoryParams =
  GetSandboxCheckoutLedgerStateParams & {
    items: CheckoutLineItem[];
  };

export type RecordSuccessfulSandboxCheckoutParams =
  FulfillSandboxCheckoutInventoryParams & {
    transaction: SandboxTransactionSnapshot;
  };
