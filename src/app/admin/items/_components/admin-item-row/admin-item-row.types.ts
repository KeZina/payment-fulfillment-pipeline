import type { AnyFieldApi } from "@tanstack/react-form";
import type { AdminCatalogItem } from "@/types";

export type AdminItemRowProps = {
  item: AdminCatalogItem;
};

export type AdminItemEditableFieldProps = {
  errorIdPrefix: string;
  field: AnyFieldApi;
  inputMode: "decimal" | "numeric";
};
