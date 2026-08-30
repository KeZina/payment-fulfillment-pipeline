import type { getAdminRecentOrders } from "@/lib/server";

export type AdminRecentOrder = Awaited<
  ReturnType<typeof getAdminRecentOrders>
>[number];

export type AdminRecentOrdersProps = {
  orders: AdminRecentOrder[];
};
