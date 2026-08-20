import type { ReactNode } from "react";
import type { WithChildren } from "@/types";

export type BasketItemsCardProps = WithChildren & {
  controls: ReactNode;
};
