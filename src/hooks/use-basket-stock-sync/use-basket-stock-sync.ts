import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useBasketStore } from "@/stores/basket-store";
import type { BasketProduct } from "@/types";

type ItemsStockResponse = {
  items?: BasketProduct[];
};

export function useBasketStockSync() {
  const { items, reconcileWithStock } = useBasketStore();
  const syncedSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      syncedSignatureRef.current = null;
      return;
    }

    const signature = items.map((item) => item.id).join(",");

    if (syncedSignatureRef.current === signature) {
      return;
    }

    let cancelled = false;

    void fetch(`/api/items/stock?ids=${signature}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: ItemsStockResponse | null) => {
        if (cancelled || !payload?.items) {
          return;
        }

        const adjusted = reconcileWithStock(payload.items);

        if (adjusted) {
          toast.info("Your basket was updated to match current stock levels.");
        }

        syncedSignatureRef.current = signature;
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [items, reconcileWithStock]);
}
