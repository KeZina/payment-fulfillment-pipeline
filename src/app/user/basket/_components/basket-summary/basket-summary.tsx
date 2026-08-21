import Link from "next/link";
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
            Review your delivery details and order before payment. Inventory
            is not reserved yet.
          </CardDescription>
        </CardContent>
        <CardFooter>
          <Button
            size='lg'
            className={basketSummaryStyles.checkout}
            nativeButton={false}
            render={<Link href='/user/checkout' />}
          >
            Go to checkout
          </Button>
        </CardFooter>
      </Card>
    </aside>
  );
}
