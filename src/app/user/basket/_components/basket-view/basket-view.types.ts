import type { ReactNode } from "react";
import type { WithChildren } from "@/types";

export type BasketViewProps = WithChildren & {
  emptyState: ReactNode;
};
