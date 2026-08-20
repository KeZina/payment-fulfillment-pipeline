import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { basketItemsSearchEmptyStateStyles } from "./basket-items-search-empty-state.styles";

export function BasketItemsSearchEmptyState() {
  return (
    <Empty
      className={basketItemsSearchEmptyStateStyles.root}
      role='status'
    >
      <EmptyHeader>
        <EmptyTitle>No basket items found</EmptyTitle>
        <EmptyDescription>
          Try a different search to see items in your basket.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
