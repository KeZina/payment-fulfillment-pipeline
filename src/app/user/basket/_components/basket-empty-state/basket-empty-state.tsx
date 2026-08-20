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
import { basketEmptyStateStyles } from "./basket-empty-state.styles";

export function BasketEmptyState() {
  return (
    <div className={basketEmptyStateStyles.root}>
      <Empty className={basketEmptyStateStyles.empty}>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <HugeiconsIcon
              icon={ShoppingBasket02Icon}
              strokeWidth={1.5}
              aria-hidden='true'
            />
          </EmptyMedia>
          <EmptyTitle role='heading' aria-level={1}>
            Your basket is empty
          </EmptyTitle>
          <EmptyDescription>
            Hover over an item in the store and use “Add item” to place it
            here.
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
