import "client-only";

import * as v from "valibot";
import { SANDBOX_ATTEMPT_STORAGE_KEY, SandboxAttemptStatus } from "@/constants";
import { SandboxAttemptSchema } from "@/schemas";
import type { BasketItem, SandboxAttempt } from "@/types";

const storedAttemptListeners = new Set<() => void>();

function emitStoredAttemptChange() {
  for (const listener of storedAttemptListeners) {
    listener();
  }
}

export function subscribeToStoredAttemptChanges(onStoreChange: () => void) {
  storedAttemptListeners.add(onStoreChange);

  return () => {
    storedAttemptListeners.delete(onStoreChange);
  };
}

export function subscribeToStoredAttemptStorageEvents(
  userId: string,
  onStoreChange: () => void,
) {
  const attemptStorageKey = getAttemptStorageKey(userId);

  function handleStorageChange(event: StorageEvent) {
    if (event.key === attemptStorageKey) {
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}

export function createBasketFingerprint(items: BasketItem[]) {
  return JSON.stringify(
    items
      .map(({ id, quantity, salePrice }) => ({ id, quantity, salePrice }))
      .sort((first, second) => first.id - second.id),
  );
}

export function getAttemptStorageKey(userId: string) {
  return `${SANDBOX_ATTEMPT_STORAGE_KEY}:${encodeURIComponent(
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
    const result = v.safeParse(SandboxAttemptSchema, parsedValue);

    if (!result.success) {
      return null;
    }

    if (result.output.status !== SandboxAttemptStatus.Success) {
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
  attempt: SandboxAttempt,
) {
  try {
    window.localStorage.setItem(
      getAttemptStorageKey(userId),
      JSON.stringify(attempt),
    );
    emitStoredAttemptChange();
    return true;
  } catch {
    return false;
  }
}

export function clearStoredAttempt(userId: string) {
  try {
    window.localStorage.removeItem(getAttemptStorageKey(userId));
    emitStoredAttemptChange();
  } catch {
    // The in-memory UI lock remains active if browser storage is unavailable.
  }
}
