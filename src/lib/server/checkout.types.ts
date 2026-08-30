import type { CheckoutDetails, CheckoutLineItem } from "@/types";
import { SandboxCheckoutLedgerStatus } from "@/constants";

export type SandboxTransactionSnapshot = {
  id: string;
  status: string;
  amount: string;
  currency: string;
};

export type CheckoutItemSnapshot = {
  id: number;
  name: string;
  salePrice: string;
  quantity: number;
};

export type PersistCheckoutOrderParams = {
  idempotencyKey: string;
  userId: string;
  checkoutDetails: CheckoutDetails;
  itemSnapshots: CheckoutItemSnapshot[];
  transaction: SandboxTransactionSnapshot;
};

export type SandboxCheckoutLedgerState =
  | { status: typeof SandboxCheckoutLedgerStatus.Missing }
  | { status: typeof SandboxCheckoutLedgerStatus.Conflict }
  | {
      status: typeof SandboxCheckoutLedgerStatus.Unfulfilled;
      itemSnapshots: CheckoutItemSnapshot[] | null;
    }
  | {
      status: typeof SandboxCheckoutLedgerStatus.Fulfilled;
      transaction: SandboxTransactionSnapshot;
      itemSnapshots: CheckoutItemSnapshot[] | null;
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
    checkoutDetails: CheckoutDetails;
    itemSnapshots: CheckoutItemSnapshot[];
  };
