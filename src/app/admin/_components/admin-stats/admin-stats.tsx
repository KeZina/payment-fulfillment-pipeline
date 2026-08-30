import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatBasketPrice } from "@/utils";
import { adminStatsStyles } from "./admin-stats.styles";
import type { AdminStatsProps } from "./admin-stats.types";

export function AdminStats({ orderCount, revenue }: AdminStatsProps) {
  return (
    <section className={adminStatsStyles.root} aria-label='Store totals'>
      <Card>
        <CardHeader className={adminStatsStyles.header}>
          <CardTitle className={adminStatsStyles.title}>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={adminStatsStyles.value}>{orderCount}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className={adminStatsStyles.header}>
          <CardTitle className={adminStatsStyles.title}>Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={adminStatsStyles.value}>{formatBasketPrice(revenue)}</p>
        </CardContent>
      </Card>
    </section>
  );
}
