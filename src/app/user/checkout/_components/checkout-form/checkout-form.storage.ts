import "client-only";

import * as v from "valibot";
import { BRAINTREE_SANDBOX_ATTEMPT_STORAGE_KEY } from "@/constants";
import { BraintreeSandboxAttemptSchema } from "@/schemas";
import type { BasketItem, BraintreeSandboxAttempt } from "@/types";

export function createBasketFingerprint(items: BasketItem[]) {
  return JSON.stringify(
    items
      .map(({ id, quantity, salePrice }) => ({ id, quantity, salePrice }))
      .sort((first, second) => first.id - second.id),
  );
}

export function getAttemptStorageKey(userId: string) {
  return `${BRAINTREE_SANDBOX_ATTEMPT_STORAGE_KEY}:${encodeURIComponent(
    userId,
  )}`;
}

export function readStoredAttempt(
  userId: string,
  basketFingerprint: string,
) {
  try {
    const value = window.localStorage.getItem(getAttemptStorageKey(userId));

    if (!value) {
      return null;
    }

    const parsedValue: unknown = JSON.parse(value);
    const result = v.safeParse(BraintreeSandboxAttemptSchema, parsedValue);

    if (!result.success) {
      return null;
    }

    if (result.output.status !== "success") {
      return result.output;
    }

    return result.output.basketFingerprint === basketFingerprint
      ? result.output
      : null;
  } catch {
    return null;
  }
}

export function storeAttempt(
  userId: string,
  attempt: BraintreeSandboxAttempt,
) {
  try {
    window.localStorage.setItem(
      getAttemptStorageKey(userId),
      JSON.stringify(attempt),
    );
    return true;
  } catch {
    return false;
  }
}

export function clearStoredAttempt(userId: string) {
  try {
    window.localStorage.removeItem(getAttemptStorageKey(userId));
  } catch {
    // The in-memory UI lock remains active if browser storage is unavailable.
  }
}
