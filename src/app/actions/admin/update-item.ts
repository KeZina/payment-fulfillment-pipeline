"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { item } from "@/db/schemas";
import { revalidateItemsCatalog } from "@/lib/server";
import { UpdateItemSchema } from "@/schemas";
import type { UpdateItemInput } from "@/types";
import {
  assertAdminSession,
  handleError,
  handleResponse,
  validateSchema,
} from "@/utils/server";

export async function updateItem(input: UpdateItemInput) {
  try {
    validateSchema(input, UpdateItemSchema);
    await assertAdminSession();

    const [updated] = await db
      .update(item)
      .set({
        price: input.price,
        discount: input.discount,
        quantity: Number(input.quantity),
      })
      .where(eq(item.id, input.itemId))
      .returning({ id: item.id });

    if (!updated) {
      throw new Error("Item not found");
    }

    revalidateItemsCatalog();
  } catch (e) {
    return handleError(e);
  }

  return handleResponse("Item updated");
}
