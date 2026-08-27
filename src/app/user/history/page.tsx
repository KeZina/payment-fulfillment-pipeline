import type { Metadata } from "next";
import { Suspense } from "react";
import { ProvidersClient } from "@/app/_components/providers";
import { StoreNavigation } from "@/app/_components/store-navigation";
import { HistoryContent } from "./_components/history-content";
import { HistoryLoading } from "./_components/history-loading";

export const metadata: Metadata = {
  title: "Order history",
  description: "Review your past sandbox orders and receipts.",
};

export default function Page() {
  return (
    <ProvidersClient>
      <div className='flex min-h-screen flex-col bg-muted/40'>
        <StoreNavigation />
        <Suspense fallback={<HistoryLoading />}>
          <HistoryContent />
        </Suspense>
      </div>
    </ProvidersClient>
  );
}
