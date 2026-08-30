export enum AdminNavigationSection {
  Overview = "overview",
  Items = "items",
}

export const ADMIN_NAVIGATION_ITEMS = [
  { section: AdminNavigationSection.Overview, href: "/admin", label: "Overview" },
  { section: AdminNavigationSection.Items, href: "/admin/items", label: "Catalog" },
] as const;
