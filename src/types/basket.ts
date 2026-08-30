import type * as v from "valibot";
import type { BasketItemSchema } from "@/schemas/basket";
import type { CatalogItem } from "./catalog-item";

export type BasketItem = v.InferOutput<typeof BasketItemSchema>;

export type BasketProduct = Pick<
  CatalogItem,
  "id" | "name" | "salePrice" | "quantity" | "categorySlug" | "imageUrl"
>;
