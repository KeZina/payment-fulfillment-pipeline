"use client";

import { useSyncExternalStore } from "react";
import { Badge } from "@/components/ui/badge";
import { useBasketStore } from "@/stores/basket-store";
import { CheckoutDetailsForm } from "../checkout-details-form";
import { CheckoutEmptyState } from "../checkout-empty-state";
import { CheckoutOrderSummary } from "../checkout-order-summary";
import { CheckoutPaymentPlaceholder } from "../checkout-payment-placeholder";
import { checkoutViewStyles } from "./checkout-view.styles";

const subscribeToClientHydration = () => () => undefined;

function useHasClientHydrated() {
  return useSyncExternalStore(
    subscribeToClientHydration,
    () => true,
    () => false,
  );
}

export function CheckoutView() {
  const { items } = useBasketStore();
  const hasClientHydrated = useHasClientHydrated();

  return (
    <main className={checkoutViewStyles.root}>
      <header className={checkoutViewStyles.header}>
        <h1 className={checkoutViewStyles.title}>Checkout</h1>
        <p className={checkoutViewStyles.description}>
          Add your delivery details and review your order.
        </p>
        <div className={checkoutViewStyles.notice} role='status'>
          <Badge variant='secondary'>Sandbox only</Badge>
          <span>No real money will be charged. Payment is not connected yet.</span>
        </div>
      </header>

      {!hasClientHydrated ? (
        <div className={checkoutViewStyles.loading} role='status'>
          Loading your basket…
        </div>
      ) : items.length === 0 ? (
        <CheckoutEmptyState />
      ) : (
        <div className={checkoutViewStyles.grid}>
          <div className={checkoutViewStyles.mainColumn}>
            <CheckoutDetailsForm />
            <CheckoutPaymentPlaceholder />
          </div>
          <CheckoutOrderSummary items={items} />
        </div>
      )}
    </main>
  );
}
