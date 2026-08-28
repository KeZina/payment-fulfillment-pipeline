export const settingsProfileFormStyles = {
  form: "flex flex-col gap-6",
  fields: "flex flex-col gap-4",
  footer: "flex justify-end",
  avatarRow: "flex flex-wrap items-center gap-4",
  avatarPreview:
    "size-20 shrink-0 rounded-full border border-border object-cover",
  avatarPlaceholder:
    "flex size-20 shrink-0 items-center justify-center rounded-full border border-dashed border-border bg-muted text-xs text-muted-foreground",
  avatarActions: "flex flex-col gap-2",
  avatarHint: "text-xs text-muted-foreground",
  hiddenFileInput: "sr-only",
} as const;