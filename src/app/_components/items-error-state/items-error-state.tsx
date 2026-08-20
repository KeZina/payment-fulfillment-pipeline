import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { itemsErrorStateStyles } from "./items-error-state.styles";

export function ItemsErrorState() {
  return (
    <Empty className={itemsErrorStateStyles.root} role='alert'>
      <EmptyHeader>
        <EmptyTitle className={itemsErrorStateStyles.title}>
          Unable to load items
        </EmptyTitle>
        <EmptyDescription className={itemsErrorStateStyles.description}>
          Please try changing the search or filters.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
