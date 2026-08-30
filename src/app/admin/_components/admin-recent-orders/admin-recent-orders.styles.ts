import {
  adminTableBaseStyles,
  createAdminTableClass,
} from "../_shared/admin-table.styles";

export const adminRecentOrdersStyles = {
  ...adminTableBaseStyles,
  table: createAdminTableClass("min-w-[640px]"),
  customer: "flex flex-col gap-0.5",
  email: "text-xs text-muted-foreground",
  amountCol: "text-right font-medium",
} as const;
