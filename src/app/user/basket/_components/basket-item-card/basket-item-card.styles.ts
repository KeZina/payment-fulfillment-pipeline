export const basketItemCardStyles = {
  root: "shadow-sm",
  illustration:
    "relative size-16 overflow-hidden rounded-xl bg-gradient-to-br",
  illustrationOverlay:
    "absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.65),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.2),transparent)]",
  illustrationAccent:
    "absolute bottom-3 left-3 h-3 w-9 rounded-full bg-white/55",
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
