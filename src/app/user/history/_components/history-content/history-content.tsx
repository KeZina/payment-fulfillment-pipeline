import { redirect } from "next/navigation";
import { getUserOrderHistory } from "@/lib/server";
import { getSession } from "@/utils/server";
import { HistoryEmptyState } from "../history-empty-state";
import { HistoryOrderList } from "../history-order-list";
import { historyContentStyles } from "./history-content.styles";

export async function HistoryContent() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const orders = await getUserOrderHistory(session.user.id);

  return (
    <main className={historyContentStyles.root}>
      {orders.length === 0 ? (
        <HistoryEmptyState />
      ) : (
        <HistoryOrderList
          orders={orders.map((order) => ({
            id: order.id,
            status: order.status,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt,
            lineItemCount: Number(order.lineItemCount),
          }))}
        />
      )}
    </main>
  );
}
