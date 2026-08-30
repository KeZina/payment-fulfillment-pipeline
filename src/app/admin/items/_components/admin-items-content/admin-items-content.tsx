import { AdminNavigationSection } from "@/constants";
import { getAdminItemsPage } from "@/lib/server";
import { adminItemsSearchParamsCache } from "@/schemas";
import { getAdminPageSession } from "@/utils/server";
import { adminPageContentStyles } from "@/app/admin/_components/_shared/admin-page-content.styles";
import { AdminNavigation } from "@/app/admin/_components/admin-navigation";
import { AdminItemsTable } from "../admin-items-table";
import { AdminItemsToolbar } from "../admin-items-toolbar";
import type { AdminItemsContentProps } from "./admin-items-content.types";

export async function AdminItemsContent({  searchParams,
}: AdminItemsContentProps) {
  await getAdminPageSession();

  const { search, page, limit } =
    await adminItemsSearchParamsCache.parse(searchParams);
  const normalizedSearch = search.trim() || null;

  const itemsPage = await getAdminItemsPage({
    search: normalizedSearch,
    page,
    limit,
  });

  return (
    <main className={adminPageContentStyles.root}>
      <header className={adminPageContentStyles.header}>
        <div className='flex flex-col gap-1'>
          <h1
            className={adminPageContentStyles.title}
            role='heading'
            aria-level={1}
          >
            Catalog management
          </h1>
          <p className={adminPageContentStyles.description}>
            Update list prices, discounts, and stock levels for storefront items.
          </p>
        </div>
        <AdminNavigation active={AdminNavigationSection.Items} />
      </header>
      <AdminItemsToolbar />
      <AdminItemsTable
        hasSearchQuery={Boolean(normalizedSearch)}
        items={itemsPage.data}
        page={itemsPage.page}
        total={itemsPage.total}
        totalPages={itemsPage.totalPages}
      />
    </main>
  );
}
