export type CursorToken = {
  fingerprint: {
    sortBy: string | null;
    maxPrice: string | null;
    hasDiscount: string | null;
  };
  values: Record<string, any>;
};
