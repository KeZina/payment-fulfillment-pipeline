import Link from "next/link";
import { redirect } from "next/navigation";
import { HistoryOrderDetail } from "@/app/user/history/[orderId]/_components/history-order-detail";
import { Button } from "@/components/ui/button";
import { getUserOrderByIdempotencyKey } from "@/lib/server";
import { getSession } from "@/utils/server";
import { confirmationContentStyles } from "./confirmation-content.styles";
import type { ConfirmationContentProps } from "./confirmation-content.types";

export async function ConfirmationContent({
  searchParams,
}: ConfirmationContentProps) {
  const session = await getSession();
  const { idempotencyKey } = await searchParams;

  if (!session) {
    const callbackUrl = idempotencyKey
      ? `/user/checkout/confirmation?idempotencyKey=${idempotencyKey}`
      : "/user/checkout/confirmation";

    redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  if (!idempotencyKey) {
    redirect("/user/checkout");
  }

  const order = await getUserOrderByIdempotencyKey(
    session.user.id,
    idempotencyKey,
  );

  if (!order) {
    return (
      <main className={confirmationContentStyles.pending}>
        <h1 className={confirmationContentStyles.pendingTitle}>
          Order confirmation pending
        </h1>
        <p className={confirmationContentStyles.pendingDescription}>
          Your payment was approved, but the receipt is still being saved.
          Refresh this page in a moment or check order history.
        </p>
        <Button nativeButton={false} render={<Link href='/user/history' />}>
          View order history
        </Button>
      </main>
    );
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
      title='Order confirmed'
      backHref='/'
      backLabel='Continue shopping'
    />
  );
}
