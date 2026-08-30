import {
  adminTableBaseStyles,
  createAdminTableClass,
} from "@/app/admin/_components/_shared/admin-table.styles";

export const adminItemsTableStyles = {
  ...adminTableBaseStyles,
  table: createAdminTableClass("min-w-[760px]"),
} as const;
