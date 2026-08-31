import type { Metadata } from "next";
import { CheckoutView } from "./_components/checkout-view";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Add delivery details and review your order.",
};

export default function Page() {
  return (
    <div className='flex min-h-dvh flex-col bg-muted/40'>
      <CheckoutView />
    </div>
  );
}
