import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
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
import { formatBasketPrice } from "@/utils";
import { checkoutOrderSummaryStyles } from "./checkout-order-summary.styles";
import type { CheckoutOrderSummaryProps } from "./checkout-order-summary.types";

export function CheckoutOrderSummary({ items }: CheckoutOrderSummaryProps) {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + Number(item.salePrice) * item.quantity,
    0,
  );

  return (
    <aside className={checkoutOrderSummaryStyles.root}>
      <Card className={checkoutOrderSummaryStyles.card}>
        <CardHeader>
          <CardTitle role='heading' aria-level={2}>
            Order summary
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ItemGroup className={checkoutOrderSummaryStyles.list}>
            {items.map((item) => {
              const unitPrice = Number(item.salePrice);

              return (
                <Item
                  key={item.id}
                  role='listitem'
                  className={checkoutOrderSummaryStyles.item}
                >
                  <ItemContent className={checkoutOrderSummaryStyles.content}>
                    <ItemTitle className={checkoutOrderSummaryStyles.itemTitle}>
                      {item.name}
                    </ItemTitle>
                    <ItemDescription>
                      {item.quantity} × {formatBasketPrice(unitPrice)}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions className={checkoutOrderSummaryStyles.price}>
                    {formatBasketPrice(unitPrice * item.quantity)}
                  </ItemActions>
                </Item>
              );
            })}
          </ItemGroup>
          <Separator className={checkoutOrderSummaryStyles.separator} />
          <div className={checkoutOrderSummaryStyles.total}>
            <span className={checkoutOrderSummaryStyles.totalLabel}>
              Subtotal
            </span>
            <strong className={checkoutOrderSummaryStyles.totalPrice}>
              {formatBasketPrice(subtotal)}
            </strong>
          </div>
        </CardContent>
        <CardFooter className={checkoutOrderSummaryStyles.footer}>
          <Button
            variant='outline'
            className={checkoutOrderSummaryStyles.back}
            nativeButton={false}
            render={<Link href='/user/basket' />}
          >
            Edit basket
          </Button>
        </CardFooter>
      </Card>
    </aside>
  );
}
