import * as v from "valibot";
import { BasketPriceSchema, PositiveIntegerSchema } from "./shared";

export const BasketItemSchema = v.pipe(
  v.object({
    id: PositiveIntegerSchema,
    name: v.pipe(v.string(), v.nonEmpty(), v.maxLength(500)),
    salePrice: BasketPriceSchema,
    quantity: PositiveIntegerSchema,
    availableQuantity: PositiveIntegerSchema,
  }),
  v.check(
    ({ quantity, availableQuantity }) => quantity <= availableQuantity,
    "Basket quantity cannot exceed available stock.",
  ),
);

const BasketItemsSchema = v.pipe(
  v.array(BasketItemSchema),
  v.check(
    (items) => new Set(items.map(({ id }) => id)).size === items.length,
    "Basket item IDs must be unique.",
  ),
);

const PersistedBasketSchema = v.object({
  items: BasketItemsSchema,
});

export const parsePersistedBasket = v.safeParser(PersistedBasketSchema);
