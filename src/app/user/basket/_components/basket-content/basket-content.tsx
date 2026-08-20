import { BasketEmptyState } from "../basket-empty-state";
import { BasketItemsCard } from "../basket-items-card";
import { BasketItemsCardControls } from "../basket-items-card-controls";
import { BasketItemsList } from "../basket-items-list";
import { BasketItemsSearchEmptyState } from "../basket-items-search-empty-state";
import { BasketSubtotal } from "../basket-subtotal";
import { BasketSummary } from "../basket-summary";
import { BasketView } from "../basket-view";
import { basketContentStyles } from "./basket-content.styles";

export function BasketContent() {
  return (
    <main className={basketContentStyles.root}>
      <BasketView emptyState={<BasketEmptyState />}>
        <BasketItemsCard controls={<BasketItemsCardControls />}>
          <BasketItemsList emptyState={<BasketItemsSearchEmptyState />} />
        </BasketItemsCard>
        <BasketSummary subtotal={<BasketSubtotal />} />
      </BasketView>
    </main>
  );
}
