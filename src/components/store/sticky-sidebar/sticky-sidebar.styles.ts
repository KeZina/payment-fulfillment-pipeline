export const stickySidebarStyles = {
  root:
    "flex w-full flex-col lg:sticky lg:top-20 lg:z-40 lg:max-h-[calc(100dvh-5rem)] lg:self-start",
  card: "flex max-h-full min-h-0 flex-col overflow-hidden bg-muted/50",
  header: "shrink-0",
  scrollArea: "min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]",
  pinned: "shrink-0 border-t px-(--card-spacing) pt-4",
  footer: "shrink-0 border-t",
} as const;
