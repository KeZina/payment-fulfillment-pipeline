import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { itemsEmptyStateStyles } from "./items-empty-state.styles";

export function ItemsEmptyState() {
  return (
    <Empty className={itemsEmptyStateStyles.root} role='status'>
      <EmptyHeader>
        <EmptyTitle>No items found</EmptyTitle>
        <EmptyDescription>
          No items match your search or selected filters.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
