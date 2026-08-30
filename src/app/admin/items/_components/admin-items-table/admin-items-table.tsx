import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminItemRow } from "../admin-item-row";
import { AdminItemsPagination } from "../admin-items-pagination";
import { AdminItemsSearchEmptyState } from "../admin-items-search-empty-state";
import { adminItemsTableStyles } from "./admin-items-table.styles";
import type { AdminItemsTableProps } from "./admin-items-table.types";

export function AdminItemsTable({
  items,
  hasSearchQuery,
  page,
  total,
  totalPages,
}: AdminItemsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle role='heading' aria-level={2}>
          Items
        </CardTitle>
        <CardDescription>
          Discounts use decimal form from 0.00 to 1.00 (for example, 0.15 is
          15% off).
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        {items.length === 0 ? (
          hasSearchQuery ? (
            <AdminItemsSearchEmptyState />
          ) : (
            <p className={adminItemsTableStyles.empty}>No catalog items found.</p>
          )
        ) : (
          <div className={adminItemsTableStyles.tableWrapper}>
            <table className={adminItemsTableStyles.table}>
              <thead>
                <tr>
                  <th scope='col'>Item</th>
                  <th scope='col'>Price</th>
                  <th scope='col'>Discount</th>
                  <th scope='col'>Stock</th>
                  <th scope='col'>Sale price</th>
                  <th scope='col'>
                    <span className='sr-only'>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <AdminItemRow key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        <AdminItemsPagination
          page={page}
          total={total}
          totalPages={totalPages}
        />
      </CardContent>
    </Card>
  );
}
