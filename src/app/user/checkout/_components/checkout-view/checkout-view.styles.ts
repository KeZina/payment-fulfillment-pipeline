export const checkoutViewStyles = {
  root: "mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10",
  header: "flex max-w-2xl flex-col gap-3",
  title:
    "font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl",
  description: "text-base text-muted-foreground",
  notice:
    "flex w-fit flex-wrap items-center gap-2 text-sm text-muted-foreground",
  grid: "grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start",
  mainColumn: "flex min-w-0 flex-col gap-6",
  loading:
    "flex min-h-64 items-center justify-center rounded-2xl border border-dashed bg-card text-sm text-muted-foreground",
} as const;
