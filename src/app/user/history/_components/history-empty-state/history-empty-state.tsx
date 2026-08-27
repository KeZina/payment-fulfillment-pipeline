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
import { historyEmptyStateStyles } from "./history-empty-state.styles";

export function HistoryEmptyState() {
  return (
    <div className={historyEmptyStateStyles.root}>
      <Empty className={historyEmptyStateStyles.empty}>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <HugeiconsIcon
              icon={ShoppingBasket02Icon}
              strokeWidth={1.5}
              aria-hidden='true'
            />
          </EmptyMedia>
          <EmptyTitle role='heading' aria-level={1}>
            No orders yet
          </EmptyTitle>
          <EmptyDescription>
            Completed sandbox checkouts will appear here with delivery details
            and a full receipt.
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
