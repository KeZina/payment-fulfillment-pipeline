import type { Item } from "./item";

export type CatalogItem = Item & {
  imageUrl: string;
};
