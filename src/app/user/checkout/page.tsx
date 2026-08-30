import type { Metadata } from "next";
import { ProvidersClient } from "@/app/_components/providers";
import { StoreNavigation } from "@/app/_components/store-navigation";
import { CheckoutView } from "./_components/checkout-view";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Add delivery details and review your order.",
};

export default function Page() {
  return (
    <ProvidersClient>
      <div className='flex min-h-dvh flex-col bg-muted/40'>
        <StoreNavigation />
        <CheckoutView />
      </div>
    </ProvidersClient>
  );
}
