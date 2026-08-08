import { ItemsSortFields } from "@/constants";

export type ItemsSortFieldsValues =
  (typeof ItemsSortFields)[keyof typeof ItemsSortFields];
