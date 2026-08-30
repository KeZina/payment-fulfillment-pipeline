import "server-only";

import { sql } from "drizzle-orm";
import { item } from "@/db/schemas";

export function buildItemTextSearchCondition(search: string) {
  return sql`(
    strpos(lower(${item.name}), lower(${search})) > 0
    OR strpos(lower(coalesce(${item.description}, '')), lower(${search})) > 0
  )`;
}
