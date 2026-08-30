import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
  StickySidebar,
  StickySidebarCard,
  StickySidebarFooter,
  StickySidebarHeader,
  StickySidebarPinned,
  StickySidebarScrollArea,
} from "@/components/store/sticky-sidebar";
import { Separator } from "@/components/ui/separator";
import { basketSummaryStyles } from "./basket-summary.styles";
import type { BasketSummaryProps } from "./basket-summary.types";

export function BasketSummary({ subtotal }: BasketSummaryProps) {
  return (
    <StickySidebar>
      <StickySidebarCard>
        <StickySidebarHeader>
          <CardTitle
            role='heading'
            aria-level={2}
            className={basketSummaryStyles.title}
          >
            Summary
          </CardTitle>
        </StickySidebarHeader>
        <StickySidebarScrollArea>
          <CardDescription className={basketSummaryStyles.description}>
            Review your delivery details and order before payment. Inventory
            is not reserved yet.
          </CardDescription>
        </StickySidebarScrollArea>
        <StickySidebarPinned>
          <div className={basketSummaryStyles.row}>
            <span className={basketSummaryStyles.label}>Subtotal</span>
            <strong className={basketSummaryStyles.subtotal}>{subtotal}</strong>
          </div>
          <Separator className={basketSummaryStyles.separator} />
        </StickySidebarPinned>
        <StickySidebarFooter>
          <Button
            size='lg'
            className={basketSummaryStyles.checkout}
            nativeButton={false}
            render={<Link href='/user/checkout' />}
          >
            Go to checkout
          </Button>
        </StickySidebarFooter>
      </StickySidebarCard>
    </StickySidebar>
  );
}
