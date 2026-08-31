import type { Metadata } from "next";
import { Suspense } from "react";
import { SettingsContent } from "./_components/settings-content";
import { SettingsLoading } from "./_components/settings-loading";

export const metadata: Metadata = {
  title: "Account settings",
  description: "Manage your profile, password, and account preferences.",
};

export default function Page() {
  return (
    <div className='flex min-h-screen flex-col bg-muted/40'>
      <Suspense fallback={<SettingsLoading />}>
        <SettingsContent />
      </Suspense>
    </div>
  );
}
