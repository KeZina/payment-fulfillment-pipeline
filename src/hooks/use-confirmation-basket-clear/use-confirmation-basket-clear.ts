import { useEffect } from "react";
import { useBasketStore } from "@/stores/basket-store";

export function useConfirmationBasketClear() {
  const { clearBasket } = useBasketStore();

  useEffect(() => {
    clearBasket();
  }, [clearBasket]);
}
