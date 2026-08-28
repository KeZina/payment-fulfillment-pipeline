import type { Metadata } from "next";
import { Suspense } from "react";
import { ProvidersClient } from "@/app/_components/providers";
import { StoreNavigation } from "@/app/_components/store-navigation";
import { SettingsContent } from "./_components/settings-content";
import { SettingsLoading } from "./_components/settings-loading";

export const metadata: Metadata = {
  title: "Account settings",
  description: "Manage your profile, password, and account preferences.",
};

export default function Page() {
  return (
    <ProvidersClient>
      <div className='flex min-h-screen flex-col bg-muted/40'>
        <StoreNavigation />
        <Suspense fallback={<SettingsLoading />}>
          <SettingsContent />
        </Suspense>
      </div>
    </ProvidersClient>
  );
}
