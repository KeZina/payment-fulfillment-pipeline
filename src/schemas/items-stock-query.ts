import "server-only";

import * as v from "valibot";

const ItemStockIdsQueryParamSchema = v.pipe(
  v.string(),
  v.nonEmpty(),
  v.transform((value) =>
    value
      .split(",")
      .map((id) => Number.parseInt(id.trim(), 10))
      .filter((id) => Number.isInteger(id) && id > 0),
  ),
  v.minLength(1, "At least one item id is required"),
  v.maxLength(50, "Too many item ids requested"),
);

export const ItemsStockQuerySchema = v.object({
  ids: ItemStockIdsQueryParamSchema,
});

export type ItemsStockQuery = v.InferOutput<typeof ItemsStockQuerySchema>;

export const parseItemsStockQuery = v.safeParser(ItemsStockQuerySchema);
