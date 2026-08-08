"use client";

import {
  MenubarCheckboxItem,
  MenubarContent,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { SortOrder } from "@/constants";
import { useQueryStates } from "nuqs";
import { itemsSearchParamsParsers } from "@/schemas/items-search-params";

export function ToolbarContentContainer() {
  const [{ salePrice, hasDiscount }, setFilters] = useQueryStates(itemsSearchParamsParsers);

  return (
    <>
      <MenubarMenu>
        <MenubarTrigger>Price</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup
            value={salePrice}
            onValueChange={(value) =>
              setFilters({ salePrice: value as SortOrder })
            }
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
          onCheckedChange={(checked) =>
            setFilters({ hasDiscount: checked as boolean })
          }
        >
          On discount
        </MenubarCheckboxItem>
      </MenubarMenu>
    </>
  );
}
