import type { CatalogItem } from "@/types";
import type { Ref } from "react";

export type ItemCardProps = {
  item: CatalogItem;
  isPlaceholder?: boolean;
  ref?: Ref<HTMLDivElement>;
};
