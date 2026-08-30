import {
  getAdminOrderStats,
  getAdminRecentOrders,
} from "@/lib/server";
import { AdminNavigationSection } from "@/constants";
import { getAdminPageSession } from "@/utils/server";
import { adminPageContentStyles } from "../_shared/admin-page-content.styles";
import { AdminNavigation } from "../admin-navigation";
import { AdminRecentOrders } from "../admin-recent-orders";
import { AdminStats } from "../admin-stats";

export async function AdminOverviewContent() {
  await getAdminPageSession();

  const [stats, recentOrders] = await Promise.all([
    getAdminOrderStats(),
    getAdminRecentOrders(),
  ]);

  return (
    <main className={adminPageContentStyles.root}>
      <header className={adminPageContentStyles.header}>
        <div className='flex flex-col gap-1'>
          <h1
            className={adminPageContentStyles.title}
            role='heading'
            aria-level={1}
          >
            Admin dashboard
          </h1>
          <p className={adminPageContentStyles.description}>
            Store-wide order activity and catalog management.
          </p>
        </div>
        <AdminNavigation active={AdminNavigationSection.Overview} />
      </header>
      <AdminStats
        orderCount={stats.orderCount}
        revenue={stats.revenue}
      />
      <AdminRecentOrders orders={recentOrders} />
    </main>
  );
}
