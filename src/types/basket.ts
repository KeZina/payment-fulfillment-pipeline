import type * as v from "valibot";
import type { BasketItemSchema } from "@/schemas/basket";
import type { Item } from "./item";

export type BasketItem = v.InferOutput<typeof BasketItemSchema>;

export type BasketProduct = Pick<
  Item,
  "id" | "name" | "salePrice" | "quantity"
>;
