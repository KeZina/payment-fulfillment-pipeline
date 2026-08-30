"use client";

import { useState, useTransition } from "react";
import { useQueryStates } from "nuqs";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { adminItemsSearchParamsParsers } from "@/schemas";
import { adminItemsPaginationStyles } from "./admin-items-pagination.styles";
import type {
  AdminItemsPaginationProps,
  PaginationDirection,
} from "./admin-items-pagination.types";

export function AdminItemsPagination({
  page,
  totalPages,
  total,
}: AdminItemsPaginationProps) {
  const [isPending, startTransition] = useTransition();
  const [pendingDirection, setPendingDirection] =
    useState<PaginationDirection | null>(null);
  const [, setFilters] = useQueryStates(adminItemsSearchParamsParsers);

  if (total === 0) {
    return null;
  }

  const canGoPrevious = page > 1;
  const canGoNext = totalPages > 0 && page < totalPages;

  const goToPage = (nextPage: number, direction: PaginationDirection) => {
    setPendingDirection(direction);
    setFilters({ page: nextPage }, { history: "replace", startTransition });
  };

  return (
    <nav
      aria-label='Catalog pagination'
      className={adminItemsPaginationStyles.root}
    >
      <p className={adminItemsPaginationStyles.summary}>
        Showing page {page} of {totalPages} ({total}{" "}
        {total === 1 ? "item" : "items"})
      </p>
      <div className={adminItemsPaginationStyles.controls}>
        <Button
          disabled={!canGoPrevious || isPending}
          onClick={() => goToPage(page - 1, "previous")}
          size='sm'
          type='button'
          variant='outline'
        >
          {isPending && pendingDirection === "previous" && (
            <Spinner data-icon='inline-start' />
          )}
          Previous
        </Button>
        <Button
          disabled={!canGoNext || isPending}
          onClick={() => goToPage(page + 1, "next")}
          size='sm'
          type='button'
          variant='outline'
        >
          {isPending && pendingDirection === "next" && (
            <Spinner data-icon='inline-start' />
          )}
          Next
        </Button>
      </div>
    </nav>
  );
}
