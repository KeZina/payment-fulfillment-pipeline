import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { WithChildren } from "@/types";
import { cn } from "@/lib";
import { Toaster } from "@/components/ui/sonner";
import { ProvidersClient } from "@/app/_components/providers";
import { StoreNavigation } from "@/app/_components/store-navigation";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Pantry · Full-Stack Food Storefront",
    template: "%s · Pantry",
  },
  description:
    "Browse a server-backed catalog, persist your basket, and checkout with Braintree Sandbox Hosted Fields—featuring server-authoritative payments, order history, and an admin catalog dashboard.",
  applicationName: "Pantry",
  openGraph: {
    title: "Pantry · Full-Stack Food Storefront",
    description:
      "A demo food storefront with Braintree Sandbox checkout, order history, and admin catalog tools.",
    siteName: "Pantry",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pantry · Full-Stack Food Storefront",
    description:
      "A demo food storefront with Braintree Sandbox checkout, order history, and admin catalog tools.",
  },
};

export default function Layout({ children }: WithChildren) {
  return (
    <html
      lang='en'
      className={cn("h-full", "antialiased", plusJakartaSans.className)}
    >
      <body className='flex min-h-full flex-col'>
        <ProvidersClient>
          <StoreNavigation />
          <div className='flex min-h-full flex-1 flex-col'>{children}</div>
        </ProvidersClient>
        <Toaster position='top-right' />
      </body>
    </html>
  );
}
