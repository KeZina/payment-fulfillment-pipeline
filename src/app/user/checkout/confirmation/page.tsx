import type { Metadata } from "next";
import { Suspense } from "react";
import { ProvidersClient } from "@/app/_components/providers";
import { StoreNavigation } from "@/app/_components/store-navigation";
import { ConfirmationClient } from "./_components/confirmation-client";
import { ConfirmationContent } from "./_components/confirmation-content";
import { ConfirmationLoading } from "./_components/confirmation-loading";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Your sandbox order was placed successfully.",
};

type ConfirmationPageProps = {
  searchParams: Promise<{
    idempotencyKey?: string;
  }>;
};

export default function Page({ searchParams }: ConfirmationPageProps) {
  return (
    <ProvidersClient>
      <ConfirmationClient>
        <div className='flex min-h-dvh flex-col bg-muted/40'>
          <StoreNavigation />
          <Suspense fallback={<ConfirmationLoading />}>
            <ConfirmationContent searchParams={searchParams} />
          </Suspense>
        </div>
      </ConfirmationClient>
    </ProvidersClient>
  );
}
