import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { basketSummaryStyles } from "./basket-summary.styles";
import type { BasketSummaryProps } from "./basket-summary.types";

export function BasketSummary({ subtotal }: BasketSummaryProps) {
  return (
    <aside className={basketSummaryStyles.root}>
      <Card className={basketSummaryStyles.card}>
        <CardHeader>
          <CardTitle
            role='heading'
            aria-level={2}
            className={basketSummaryStyles.title}
          >
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={basketSummaryStyles.row}>
            <span className={basketSummaryStyles.label}>Subtotal</span>
            <strong className={basketSummaryStyles.subtotal}>
              {subtotal}
            </strong>
          </div>
          <Separator className={basketSummaryStyles.separator} />
          <CardDescription className={basketSummaryStyles.description}>
            Inventory is reserved only after checkout. Checkout will be added
            in the next step.
          </CardDescription>
        </CardContent>
        <CardFooter>
          <Button
            type='button'
            className={basketSummaryStyles.checkout}
            disabled
          >
            Checkout coming soon
          </Button>
        </CardFooter>
      </Card>
    </aside>
  );
}
