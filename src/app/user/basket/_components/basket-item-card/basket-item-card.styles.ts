export const basketItemCardStyles = {
  root: "shadow-sm",
  illustration: "relative size-16 overflow-hidden rounded-xl bg-slate-100",
  image: "size-full object-cover",
  details: "min-w-0 flex-1",
  price: "text-sm font-semibold text-primary",
  availability: "text-xs text-muted-foreground",
  actions: "ml-auto flex-nowrap",
  quantityControl:
    "flex shrink-0 items-center rounded-full border border-border bg-muted p-1",
  separator: "mx-1",
  quantity:
    "min-w-5 text-center text-xs font-bold tabular-nums text-foreground",
} as const;
