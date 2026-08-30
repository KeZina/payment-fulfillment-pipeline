import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminOverviewContent } from "./_components/admin-overview-content";
import { AdminPageLoading } from "./_components/admin-page-loading";

export const metadata: Metadata = {
  title: "Admin dashboard",
  description: "Store-wide order overview and catalog management.",
};

export default function Page() {
  return (
    <Suspense
      fallback={<AdminPageLoading message='Loading admin dashboard…' />}
    >
      <AdminOverviewContent />
    </Suspense>
  );
}
