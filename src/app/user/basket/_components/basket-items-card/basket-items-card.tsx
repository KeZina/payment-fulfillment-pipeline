import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { basketItemsCardStyles } from "./basket-items-card.styles";
import type { BasketItemsCardProps } from "./basket-items-card.types";

export function BasketItemsCard({
  children,
  controls,
}: BasketItemsCardProps) {
  return (
    <Card className={basketItemsCardStyles.root}>
      <CardHeader>
        <div>
          <p className={basketItemsCardStyles.eyebrow}>Your order</p>
          <CardTitle
            role='heading'
            aria-level={1}
            className={basketItemsCardStyles.title}
          >
            Basket
          </CardTitle>
        </div>
        {controls}
      </CardHeader>

      <CardContent className={basketItemsCardStyles.content}>
        {children}
      </CardContent>
    </Card>
  );
}
