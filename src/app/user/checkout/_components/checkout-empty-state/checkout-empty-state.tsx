import Link from "next/link";
import { ShoppingBasket02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { checkoutEmptyStateStyles } from "./checkout-empty-state.styles";

export function CheckoutEmptyState() {
  return (
    <div className={checkoutEmptyStateStyles.root}>
      <Empty className={checkoutEmptyStateStyles.empty}>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <HugeiconsIcon
              icon={ShoppingBasket02Icon}
              strokeWidth={1.5}
              aria-hidden='true'
            />
          </EmptyMedia>
          <EmptyTitle role='heading' aria-level={2}>
            Your basket is empty
          </EmptyTitle>
          <EmptyDescription>
            Add at least one item before checking out.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            size='lg'
            nativeButton={false}
            render={<Link href='/' />}
          >
            Browse items
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
