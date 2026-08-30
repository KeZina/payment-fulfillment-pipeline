export const itemCardClassName =
  "group flex h-full w-full origin-center transform-gpu flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-[transform,box-shadow,border-color] duration-200 will-change-transform hover:z-10 hover:-translate-y-1 hover:scale-[1.025] hover:border-emerald-200 hover:shadow-[0_14px_30px_-16px_rgba(5,150,105,0.55)] focus-within:z-10 focus-within:-translate-y-1 focus-within:border-emerald-200 focus-within:shadow-[0_14px_30px_-16px_rgba(5,150,105,0.55)] motion-reduce:transform-none";

export const outOfStockItemCardClassName =
  "bg-slate-50 opacity-70 hover:z-auto hover:translate-y-0 hover:scale-100 hover:border-slate-200 hover:shadow-sm";

export const itemCardStyles = {
  imageWrapper: "relative mb-3 overflow-hidden rounded-lg border border-slate-100 bg-slate-50",
  image: "h-32 w-full object-cover sm:h-36",
  badge:
    "absolute left-2 top-2 rounded-full bg-rose-500 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-white",
  title: "line-clamp-2 min-h-[2lh] w-full text-sm font-semibold text-slate-800",
  description: "mt-1 line-clamp-2 text-xs text-slate-500",
  priceRow: "mt-2 flex flex-wrap items-center gap-2",
  originalPrice: "text-xs text-slate-400 line-through",
  salePrice: "font-bold text-emerald-600",
  outOfStockPrice: "text-slate-500",
  stockLabel: "mt-1 text-xs text-slate-500",
  lowStockLabel: "mt-1 text-xs font-medium text-amber-700",
} as const;
