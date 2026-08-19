import { Item } from "@/types";
import type { Ref } from "react";

export type ItemCardProps = {
  item: Item;
  isPlaceholder?: boolean;
  ref?: Ref<HTMLDivElement>;
};
