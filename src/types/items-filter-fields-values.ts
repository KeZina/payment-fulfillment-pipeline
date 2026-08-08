import { ItemsFilterFields } from "@/constants";

export type ItemsFilterFieldsValues =
  (typeof ItemsFilterFields)[keyof typeof ItemsFilterFields];
