"use client";

import {
  MenubarContent,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import {
  ITEMS_PAGINATION_LIMIT,
  ITEMS_PAGINATION_LIMITS,
  type ItemsPaginationLimit,
  SortOrder,
} from "@/constants";
import { itemsSearchParamsParsers } from "@/schemas/items-search-params";
import { useQueryStates } from "nuqs";

export function ToolbarContentContainer() {
  const [{ search, salePrice, hasDiscount, inStockOnly, limit }, setFilters] =
    useQueryStates(itemsSearchParamsParsers);

  const handleSalePriceChange = (value: SortOrder) => {
    setFilters({ salePrice: value });
  };

  const handleDiscountChange = (checked: boolean) => {
    setFilters({ hasDiscount: checked });
  };

  const handleInStockOnlyChange = (checked: boolean) => {
    setFilters({ inStockOnly: checked });
  };

  const handleLimitChange = (value: ItemsPaginationLimit) => {
    setFilters({ limit: value });
  };

  const hasActiveFilters =
    search.trim().length > 0 ||
    salePrice !== null ||
    hasDiscount ||
    inStockOnly ||
    limit !== ITEMS_PAGINATION_LIMIT;

  const handleResetFilters = () => {
    setFilters({
      search: null,
      salePrice: null,
      hasDiscount: false,
      inStockOnly: false,
      limit: ITEMS_PAGINATION_LIMIT,
    });
  };

  const priceLabel =
    salePrice === SortOrder.Desc
      ? "Price: high to low"
      : salePrice === SortOrder.Asc
        ? "Price: low to high"
        : "Sort by price";

  return (
    <>
      <span className='px-2 text-xs font-semibold uppercase tracking-wide text-slate-500'>
        Filters
      </span>
      <span className='mx-1 h-5 w-px bg-slate-200' aria-hidden='true' />
      <MenubarMenu>
        <MenubarTrigger className='h-8 w-36 whitespace-nowrap px-3'>
          {priceLabel}
        </MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup
            value={salePrice}
            onValueChange={handleSalePriceChange}
          >
            <MenubarRadioItem value={SortOrder.Desc}>
              Priciest first
            </MenubarRadioItem>
            <MenubarRadioItem value={SortOrder.Asc}>
              Cheapest first
            </MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
      <Button
        aria-pressed={hasDiscount}
        onClick={() => handleDiscountChange(!hasDiscount)}
        size='sm'
        type='button'
        variant={hasDiscount ? "secondary" : "ghost"}
      >
        On discount
      </Button>
      <Button
        aria-pressed={inStockOnly}
        onClick={() => handleInStockOnlyChange(!inStockOnly)}
        size='sm'
        type='button'
        variant={inStockOnly ? "secondary" : "ghost"}
      >
        In stock only
      </Button>
      <MenubarMenu>
        <MenubarTrigger className='h-8 whitespace-nowrap px-3'>
          {limit} per page
        </MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value={limit} onValueChange={handleLimitChange}>
            {ITEMS_PAGINATION_LIMITS.map((pageSize) => (
              <MenubarRadioItem key={pageSize} value={pageSize}>
                {pageSize} items
              </MenubarRadioItem>
            ))}
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
      <Button
        className='text-slate-500'
        disabled={!hasActiveFilters}
        onClick={handleResetFilters}
        size='sm'
        type='button'
        variant='ghost'
      >
        Reset
      </Button>
    </>
  );
}
