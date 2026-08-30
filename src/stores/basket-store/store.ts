import "client-only";

import { createStore } from "zustand/vanilla";
import type { StateCreator } from "zustand/vanilla";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  AddToBasketResult,
  BASKET_STORAGE_KEY,
  initialBasketState,
} from "@/constants";
import { parsePersistedBasket } from "@/schemas/basket";
import type { BasketStore } from "./types";

const createBasketStore: StateCreator<
  BasketStore,
  [["zustand/persist", unknown]]
> = (set, get) => ({
  ...initialBasketState,

  addItem: (product) => {
    if (product.quantity < 1) {
      return AddToBasketResult.OutOfStock;
    }

    const basketItem = get().items.find((item) => item.id === product.id);
    if (basketItem && basketItem.quantity >= product.quantity) {
      return AddToBasketResult.LimitReached;
    }

    set((state) => ({
      items: basketItem
        ? state.items.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  name: product.name,
                  salePrice: product.salePrice,
                  quantity: item.quantity + 1,
                  availableQuantity: product.quantity,
                  categorySlug: product.categorySlug,
                  imageUrl: product.imageUrl,
                }
              : item,
          )
        : [
            ...state.items,
            {
              id: product.id,
              name: product.name,
              salePrice: product.salePrice,
              quantity: 1,
              availableQuantity: product.quantity,
              categorySlug: product.categorySlug,
              imageUrl: product.imageUrl,
            },
          ],
    }));

    return AddToBasketResult.Added;
  },

  increaseItemQuantity: (itemId) => {
    const basketItem = get().items.find((item) => item.id === itemId);
    if (!basketItem || basketItem.quantity >= basketItem.availableQuantity) {
      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    }));
  },

  decreaseItemQuantity: (itemId) => {
    const basketItem = get().items.find((item) => item.id === itemId);
    if (!basketItem) {
      return;
    }

    set((state) => ({
      items: state.items.flatMap((item) => {
        if (item.id !== itemId) {
          return [item];
        }

        if (item.quantity === 1) {
          return [];
        }

        return [{ ...item, quantity: item.quantity - 1 }];
      }),
    }));
  },

  removeItem: (itemId) => {
    if (!get().items.some((item) => item.id === itemId)) {
      return;
    }

    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },

  clearBasket: () => {
    if (get().items.length === 0) {
      return;
    }

    set({ items: [] });
  },

  reconcileWithStock: (liveItems) => {
    const liveById = new Map(liveItems.map((liveItem) => [liveItem.id, liveItem]));
    let adjusted = false;

    const nextItems = get().items.flatMap((basketItem) => {
      const liveItem = liveById.get(basketItem.id);

      if (!liveItem || liveItem.quantity < 1) {
        adjusted = true;
        return [];
      }

      const quantity = Math.min(basketItem.quantity, liveItem.quantity);

      if (
        quantity !== basketItem.quantity ||
        liveItem.quantity !== basketItem.availableQuantity ||
        liveItem.salePrice !== basketItem.salePrice ||
        liveItem.name !== basketItem.name
      ) {
        adjusted = true;
      }

      return [
        {
          ...basketItem,
          name: liveItem.name,
          salePrice: liveItem.salePrice,
          quantity,
          availableQuantity: liveItem.quantity,
          categorySlug: liveItem.categorySlug,
          imageUrl: liveItem.imageUrl,
        },
      ];
    });

    if (adjusted) {
      set({ items: nextItems });
    }

    return adjusted;
  },
});

export const basketStore = createStore<BasketStore>()(
  persist(createBasketStore, {
    name: BASKET_STORAGE_KEY,
    storage: createJSONStorage(() => window.localStorage),
    partialize: ({ items }) => ({ items }),
    merge: (persistedState, currentState) => {
      const result = parsePersistedBasket(persistedState);

      return result.success
        ? { ...currentState, ...result.output }
        : currentState;
    },
  }),
);
