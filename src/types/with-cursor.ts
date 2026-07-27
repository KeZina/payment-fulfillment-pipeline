export type WithCursor<T> = {
  data: T[];
  nextCursor: string | null;
};
