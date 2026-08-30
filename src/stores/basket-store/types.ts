import type { AddToBasketResult } from "@/constants";
import type { BasketItem, BasketProduct } from "@/types";

export interface BasketState {
  items: BasketItem[];
}

export interface BasketActions {
  addItem: (product: BasketProduct) => AddToBasketResult;
  increaseItemQuantity: (itemId: number) => void;
  decreaseItemQuantity: (itemId: number) => void;
  removeItem: (itemId: number) => void;
  clearBasket: () => void;
  reconcileWithStock: (
    liveItems: {
      id: number;
      name: string;
      quantity: number;
      salePrice: string;
      categorySlug: string;
      imageUrl: string;
    }[],
  ) => boolean;
}

export type BasketStore = BasketState & BasketActions;
