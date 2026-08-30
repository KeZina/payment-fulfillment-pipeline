export const adminItemsToolbarStyles = {
  root: "flex items-center justify-end",
  limitGroup: "flex items-center gap-2",
  limitLabel: "text-sm text-muted-foreground",
  limitSelect:
    "h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs transition-colors",
  limitSelectPending: "cursor-wait bg-muted/50 opacity-70",
} as const;
