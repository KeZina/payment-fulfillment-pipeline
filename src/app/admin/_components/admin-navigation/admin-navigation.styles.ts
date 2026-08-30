export const adminNavigationStyles = {
  root: "flex flex-wrap gap-2",
  link: "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
  activeLink: "bg-primary text-primary-foreground",
  inactiveLink:
    "text-muted-foreground hover:bg-muted hover:text-foreground",
} as const;
