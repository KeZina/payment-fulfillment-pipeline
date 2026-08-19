"use client";

import type { ReactNode } from "react";
import { SWRConfig } from "swr";
import { api } from "@/lib/client/axios";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export function ProvidersClient({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      <SWRConfig
        value={{
          fetcher: async (url: string) => (await api.get(url)).data,
          revalidateOnFocus: false,
          revalidateOnReconnect: true,
          shouldRetryOnError: true,
          errorRetryCount: 3,
        }}
      >
        {children}
      </SWRConfig>
    </NuqsAdapter>
  );
}
