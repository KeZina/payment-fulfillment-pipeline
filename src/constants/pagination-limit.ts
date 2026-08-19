export const ITEMS_PAGINATION_LIMITS = [10, 50, 100] as const;

export type ItemsPaginationLimit = (typeof ITEMS_PAGINATION_LIMITS)[number];

export const ITEMS_PAGINATION_LIMIT: ItemsPaginationLimit = 10;
