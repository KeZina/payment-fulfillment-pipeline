import type { Metadata } from "next";
import { Suspense } from "react";
import { ProvidersClient } from "@/app/_components/providers";
import { StoreNavigation } from "@/app/_components/store-navigation";
import { HistoryOrderDetailContent } from "./_components/history-order-detail-content";
import { HistoryLoading } from "../_components/history-loading";

type PageProps = {
  params: Promise<{ orderId: string }>;
};

export const metadata: Metadata = {
  title: "Order receipt",
  description: "Review delivery details and line items for a past order.",
};

export default function Page({ params }: PageProps) {
  return (
    <ProvidersClient>
      <div className='flex min-h-screen flex-col bg-muted/40'>
        <StoreNavigation />
        <Suspense fallback={<HistoryLoading />}>
          <HistoryOrderDetailContent params={params} />
        </Suspense>
      </div>
    </ProvidersClient>
  );
}
