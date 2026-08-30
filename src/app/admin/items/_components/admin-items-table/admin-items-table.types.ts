import type { AdminCatalogItem } from "@/types";

export type AdminItemsTableProps = {
  items: AdminCatalogItem[];
  hasSearchQuery: boolean;
  page: number;
  total: number;
  totalPages: number;
};
