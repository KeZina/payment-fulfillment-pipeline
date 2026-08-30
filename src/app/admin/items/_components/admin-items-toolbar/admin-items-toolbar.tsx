"use client";

import type { ChangeEventHandler } from "react";
import { useTransition } from "react";
import { useQueryStates } from "nuqs";
import { Spinner } from "@/components/ui/spinner";
import {
  ITEMS_PAGINATION_LIMIT,
  ITEMS_PAGINATION_LIMITS,
  type ItemsPaginationLimit,
} from "@/constants";
import { cn } from "@/lib";
import { adminItemsSearchParamsParsers } from "@/schemas";
import { adminItemsToolbarStyles } from "./admin-items-toolbar.styles";

export function AdminItemsToolbar() {
  const [isPending, startTransition] = useTransition();
  const [{ limit }, setFilters] = useQueryStates(
    adminItemsSearchParamsParsers,
  );

  const handleLimitChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const nextLimit = Number(event.currentTarget.value) as ItemsPaginationLimit;

    setFilters(
      {
        limit: nextLimit,
        page: 1,
      },
      { startTransition },
    );
  };

  return (
    <div className={adminItemsToolbarStyles.root}>
      <div className={adminItemsToolbarStyles.limitGroup}>
        <label
          className={adminItemsToolbarStyles.limitLabel}
          htmlFor='admin-items-limit'
        >
          Per page
        </label>
        <select
          className={cn(
            adminItemsToolbarStyles.limitSelect,
            isPending && adminItemsToolbarStyles.limitSelectPending,
          )}
          disabled={isPending}
          id='admin-items-limit'
          onChange={handleLimitChange}
          value={limit ?? ITEMS_PAGINATION_LIMIT}
        >
          {ITEMS_PAGINATION_LIMITS.map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
        {isPending && <Spinner aria-hidden='true' />}
      </div>
    </div>
  );
}
