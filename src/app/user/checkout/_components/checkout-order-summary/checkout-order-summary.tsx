import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardAction, CardTitle } from "@/components/ui/card";
import {
  StickySidebar,
  StickySidebarCard,
  StickySidebarFooter,
  StickySidebarHeader,
  StickySidebarPinned,
  StickySidebarScrollArea,
} from "@/components/store/sticky-sidebar";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
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
    <StickySidebar>
      <StickySidebarCard>
        <StickySidebarHeader>
          <CardTitle role='heading' aria-level={2}>
            Order summary
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </Badge>
          </CardAction>
        </StickySidebarHeader>
        <StickySidebarScrollArea>
          <ItemGroup className={checkoutOrderSummaryStyles.list}>
            {items.map((item) => {
              const unitPrice = Number(item.salePrice);

              return (
                <Item
                  key={item.id}
                  role='listitem'
                  className={checkoutOrderSummaryStyles.item}
                >
                  <ItemContent
                    className={checkoutOrderSummaryStyles.contentItem}
                  >
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
        </StickySidebarScrollArea>
        <StickySidebarPinned>
          <div className={checkoutOrderSummaryStyles.total}>
            <span className={checkoutOrderSummaryStyles.totalLabel}>
              Subtotal
            </span>
            <strong className={checkoutOrderSummaryStyles.totalPrice}>
              {formatBasketPrice(subtotal)}
            </strong>
          </div>
        </StickySidebarPinned>
        <StickySidebarFooter>
          <Button
            variant='outline'
            className={checkoutOrderSummaryStyles.back}
            nativeButton={false}
            render={<Link href='/user/basket' />}
          >
            Edit basket
          </Button>
        </StickySidebarFooter>
      </StickySidebarCard>
    </StickySidebar>
  );
}
