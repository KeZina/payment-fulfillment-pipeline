import type { ItemsPaginationLimit } from "@/constants";

export type GetAdminItemsPageParams = {
  search?: string | null;
  page?: number;
  limit?: ItemsPaginationLimit;
};

export type AdminCatalogItem = {
  id: number;
  name: string;
  price: string;
  discount: string;
  quantity: number;
  salePrice: string;
};

export type AdminItemsPage = {
  data: AdminCatalogItem[];
  page: number;
  limit: ItemsPaginationLimit;
  total: number;
  totalPages: number;
};
