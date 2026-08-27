import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatBasketPrice,
  formatOrderDate,
  formatOrderStatus,
} from "@/utils";
import { historyOrderCardStyles } from "./history-order-card.styles";
import type { HistoryOrderCardProps } from "./history-order-card.types";

export function HistoryOrderCard({
  id,
  status,
  totalAmount,
  createdAt,
  lineItemCount,
}: HistoryOrderCardProps) {
  return (
    <Card className={historyOrderCardStyles.card}>
      <CardHeader className={historyOrderCardStyles.header}>
        <div className={historyOrderCardStyles.meta}>
          <CardTitle role='heading' aria-level={2}>
            {formatOrderDate(createdAt)}
          </CardTitle>
          <p className={historyOrderCardStyles.date}>
            {lineItemCount} {lineItemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Badge variant='outline'>{formatOrderStatus(status)}</Badge>
          <strong className={historyOrderCardStyles.total}>
            {formatBasketPrice(totalAmount)}
          </strong>
        </div>
      </CardHeader>
      <CardFooter className={historyOrderCardStyles.footer}>
        <Button
          variant='outline'
          className={historyOrderCardStyles.link}
          nativeButton={false}
          render={<Link href={`/user/history/${id}`} />}
        >
          View receipt
        </Button>
      </CardFooter>
    </Card>
  );
}
