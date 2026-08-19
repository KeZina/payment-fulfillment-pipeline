"use client";

import {
  MenubarCheckboxItem,
  MenubarContent,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  ITEMS_PAGINATION_LIMITS,
  type ItemsPaginationLimit,
  SortOrder,
} from "@/constants";
import { itemsSearchParamsParsers } from "@/schemas/items-search-params";
import { useQueryStates } from "nuqs";

export function ToolbarContentContainer() {
  const [{ salePrice, hasDiscount, limit }, setFilters] = useQueryStates(
    itemsSearchParamsParsers,
  );

  const handleSalePriceChange = (value: SortOrder) => {
    setFilters({ salePrice: value });
  };

  const handleDiscountChange = (checked: boolean) => {
    setFilters({ hasDiscount: checked });
  };

  const handleLimitChange = (value: ItemsPaginationLimit) => {
    setFilters({ limit: value });
  };

  return (
    <>
      <MenubarMenu>
        <MenubarTrigger>Price</MenubarTrigger>
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
      <MenubarMenu>
        <MenubarCheckboxItem
          checked={hasDiscount}
          onCheckedChange={handleDiscountChange}
        >
          On discount
        </MenubarCheckboxItem>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Page size: {limit}</MenubarTrigger>
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
    </>
  );
}
