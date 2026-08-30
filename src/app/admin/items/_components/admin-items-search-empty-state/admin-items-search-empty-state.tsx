import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { adminItemsSearchEmptyStateStyles } from "./admin-items-search-empty-state.styles";

export function AdminItemsSearchEmptyState() {
  return (
    <Empty
      className={adminItemsSearchEmptyStateStyles.root}
      role='status'
    >
      <EmptyHeader>
        <EmptyTitle>No items match your search</EmptyTitle>
        <EmptyDescription>
          Try a different name or description to find catalog items.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
