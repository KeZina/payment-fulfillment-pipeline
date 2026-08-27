import type { CheckoutLineItem } from "@/types";
import { SandboxCheckoutLedgerStatus } from "@/constants";

export type SandboxTransactionSnapshot = {
  id: string;
  status: string;
  amount: string;
  currency: string;
};

export type SandboxCheckoutLedgerState =
  | { status: typeof SandboxCheckoutLedgerStatus.Missing }
  | { status: typeof SandboxCheckoutLedgerStatus.Conflict }
  | { status: typeof SandboxCheckoutLedgerStatus.Unfulfilled }
  | {
      status: typeof SandboxCheckoutLedgerStatus.Fulfilled;
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
