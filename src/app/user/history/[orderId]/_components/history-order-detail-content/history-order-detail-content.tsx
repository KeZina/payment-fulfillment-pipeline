import { notFound, redirect } from "next/navigation";
import { getUserOrderById } from "@/lib/server";
import { getSession } from "@/utils/server";
import { HistoryOrderDetail } from "../history-order-detail";
import type { HistoryOrderDetailContentProps } from "./history-order-detail-content.types";

export async function HistoryOrderDetailContent({
  params,
}: HistoryOrderDetailContentProps) {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const { orderId } = await params;
  const order = await getUserOrderById(session.user.id, orderId);

  if (!order) {
    notFound();
  }

  return (
    <HistoryOrderDetail
      id={order.id}
      status={order.status}
      totalAmount={order.totalAmount}
      currency={order.currency}
      createdAt={order.createdAt}
      recipientName={order.recipientName}
      email={order.email}
      phone={order.phone}
      deliveryAddress={order.deliveryAddress}
      deliveryInstructions={order.deliveryInstructions}
      lineItems={order.lineItems.map((lineItem) => ({
        id: lineItem.id,
        itemName: lineItem.itemName,
        unitPrice: lineItem.unitPrice,
        quantity: lineItem.quantity,
        lineTotal: lineItem.lineTotal,
      }))}
    />
  );
}
