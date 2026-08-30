import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatBasketPrice,
  formatOrderDate,
  formatOrderStatus,
} from "@/utils";
import { adminRecentOrdersStyles } from "./admin-recent-orders.styles";
import type { AdminRecentOrdersProps } from "./admin-recent-orders.types";

export function AdminRecentOrders({ orders }: AdminRecentOrdersProps) {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle role='heading' aria-level={2}>
            Recent orders
          </CardTitle>
          <CardDescription>
            Latest sandbox checkouts across all customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className={adminRecentOrdersStyles.empty}>
              No orders yet. Completed checkouts will appear here.
            </p>
          ) : (
            <div className={adminRecentOrdersStyles.tableWrapper}>
              <table className={adminRecentOrdersStyles.table}>
                <thead>
                  <tr>
                    <th scope='col'>Date</th>
                    <th scope='col'>Customer</th>
                    <th scope='col'>Recipient</th>
                    <th scope='col'>Status</th>
                    <th scope='col' className={adminRecentOrdersStyles.amountCol}>
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{formatOrderDate(order.createdAt)}</td>
                      <td>
                        <div className={adminRecentOrdersStyles.customer}>
                          <span>{order.userName}</span>
                          <span className={adminRecentOrdersStyles.email}>
                            {order.userEmail}
                          </span>
                        </div>
                      </td>
                      <td>{order.recipientName}</td>
                      <td>
                        <Badge variant='outline'>
                          {formatOrderStatus(order.status)}
                        </Badge>
                      </td>
                      <td className={adminRecentOrdersStyles.amountCol}>
                        {formatBasketPrice(order.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
