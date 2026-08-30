"use client";

import type { WithChildren } from "@/types";
import { useConfirmationBasketClear } from "@/hooks/use-confirmation-basket-clear";

export function ConfirmationClient({ children }: WithChildren) {
  useConfirmationBasketClear();

  return children;
}
