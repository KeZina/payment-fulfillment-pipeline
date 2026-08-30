export const adminTableBaseStyles = {
  empty: "text-sm text-muted-foreground",
  tableWrapper: "overflow-x-auto",
} as const;

export function createAdminTableClass(minWidthClass: string) {
  return `w-full ${minWidthClass} border-collapse text-left text-sm [&_th]:border-b [&_th]:px-3 [&_th]:py-2 [&_th]:font-medium [&_th]:text-muted-foreground [&_td]:border-b [&_td]:px-3 [&_td]:py-3 [&_tr:last-child_td]:border-b-0`;
}
