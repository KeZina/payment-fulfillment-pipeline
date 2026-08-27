import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import {
  formatBasketPrice,
  formatOrderDate,
  formatOrderStatus,
} from "@/utils";
import { historyOrderDetailStyles } from "./history-order-detail.styles";
import type { HistoryOrderDetailProps } from "./history-order-detail.types";

export function HistoryOrderDetail({
  status,
  totalAmount,
  currency,
  createdAt,
  recipientName,
  email,
  phone,
  deliveryAddress,
  deliveryInstructions,
  lineItems,
}: HistoryOrderDetailProps) {
  const itemCount = lineItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <main className={historyOrderDetailStyles.root}>
      <header className={historyOrderDetailStyles.header}>
        <div>
          <h1 className={historyOrderDetailStyles.title} role='heading' aria-level={1}>
            Order receipt
          </h1>
          <p className={historyOrderDetailStyles.meta}>
            Placed {formatOrderDate(createdAt)} · {currency}
          </p>
        </div>
        <Badge variant='outline'>{formatOrderStatus(status)}</Badge>
      </header>

      <div className={historyOrderDetailStyles.grid}>
        <Card className={historyOrderDetailStyles.card}>
          <CardHeader>
            <CardTitle className={historyOrderDetailStyles.sectionTitle}>
              Delivery details
            </CardTitle>
          </CardHeader>
          <CardContent className={historyOrderDetailStyles.detailList}>
            <div>
              <p className={historyOrderDetailStyles.detailLabel}>Recipient</p>
              <p className={historyOrderDetailStyles.detailValue}>
                {recipientName}
              </p>
            </div>
            <div>
              <p className={historyOrderDetailStyles.detailLabel}>Email</p>
              <p className={historyOrderDetailStyles.detailValue}>{email}</p>
            </div>
            <div>
              <p className={historyOrderDetailStyles.detailLabel}>Phone</p>
              <p className={historyOrderDetailStyles.detailValue}>{phone}</p>
            </div>
            <div>
              <p className={historyOrderDetailStyles.detailLabel}>Address</p>
              <p className={historyOrderDetailStyles.detailValue}>
                {deliveryAddress}
              </p>
            </div>
            {deliveryInstructions ? (
              <div>
                <p className={historyOrderDetailStyles.detailLabel}>
                  Delivery instructions
                </p>
                <p className={historyOrderDetailStyles.detailValue}>
                  {deliveryInstructions}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className={historyOrderDetailStyles.card}>
          <CardHeader>
            <CardTitle className={historyOrderDetailStyles.sectionTitle}>
              Items
            </CardTitle>
            <p className={historyOrderDetailStyles.meta}>
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </CardHeader>
          <CardContent>
            <ItemGroup className={historyOrderDetailStyles.list}>
              {lineItems.map((lineItem) => (
                <Item
                  key={lineItem.id}
                  role='listitem'
                  className={historyOrderDetailStyles.item}
                >
                  <ItemContent className={historyOrderDetailStyles.content}>
                    <ItemTitle className={historyOrderDetailStyles.itemTitle}>
                      {lineItem.itemName}
                    </ItemTitle>
                    <ItemDescription>
                      {lineItem.quantity} × {formatBasketPrice(lineItem.unitPrice)}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions className={historyOrderDetailStyles.price}>
                    {formatBasketPrice(lineItem.lineTotal)}
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
            <Separator className={historyOrderDetailStyles.separator} />
            <div className={historyOrderDetailStyles.total}>
              <span className={historyOrderDetailStyles.totalLabel}>Total</span>
              <strong className={historyOrderDetailStyles.totalPrice}>
                {formatBasketPrice(totalAmount)}
              </strong>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button
        variant='outline'
        className={historyOrderDetailStyles.back}
        nativeButton={false}
        render={<Link href='/user/history' />}
      >
        Back to order history
      </Button>
    </main>
  );
}
