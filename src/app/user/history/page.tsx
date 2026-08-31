import type { Metadata } from "next";
import { Suspense } from "react";
import { HistoryContent } from "./_components/history-content";
import { HistoryLoading } from "./_components/history-loading";

export const metadata: Metadata = {
  title: "Order history",
  description: "Review your past sandbox orders and receipts.",
};

export default function Page() {
  return (
    <div className='flex min-h-screen flex-col bg-muted/40'>
      <Suspense fallback={<HistoryLoading />}>
        <HistoryContent />
      </Suspense>
    </div>
  );
}
