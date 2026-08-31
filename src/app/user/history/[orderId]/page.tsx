import type { Metadata } from "next";
import { Suspense } from "react";
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
    <div className='flex min-h-screen flex-col bg-muted/40'>
      <Suspense fallback={<HistoryLoading />}>
        <HistoryOrderDetailContent params={params} />
      </Suspense>
    </div>
  );
}
