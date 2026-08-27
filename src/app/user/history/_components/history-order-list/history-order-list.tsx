import { HistoryOrderCard } from "../history-order-card";
import { historyOrderListStyles } from "./history-order-list.styles";
import type { HistoryOrderListProps } from "./history-order-list.types";

export function HistoryOrderList({ orders }: HistoryOrderListProps) {
  return (
    <section className={historyOrderListStyles.root}>
      <header>
        <h1 className={historyOrderListStyles.title} role='heading' aria-level={1}>
          Order history
        </h1>
        <p className={historyOrderListStyles.description}>
          Review past sandbox orders, delivery details, and receipts.
        </p>
      </header>
      <div className='flex flex-col gap-4'>
        {orders.map((order) => (
          <HistoryOrderCard key={order.id} {...order} />
        ))}
      </div>
    </section>
  );
}
