import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { AdminPageLoading } from "@/app/admin/_components/admin-page-loading";
import { AdminItemsContent } from "./_components/admin-items-content";

export const metadata: Metadata = {
  title: "Admin catalog",
  description: "Manage storefront item prices, discounts, and stock.",
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default function Page({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<AdminPageLoading message='Loading catalog…' />}>
      <AdminItemsContent searchParams={searchParams} />
    </Suspense>
  );
}
