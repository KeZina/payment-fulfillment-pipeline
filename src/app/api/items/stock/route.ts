import { NextRequest, NextResponse } from "next/server";
import { getItemsStockByIds } from "@/lib/server/item-stock";
import { parseItemsStockQuery } from "@/schemas/items-stock-query";
import { handleRouteHandlerError } from "@/utils/server/rethrow-route-handler-error";

export async function GET(request: NextRequest) {
  try {
    const result = parseItemsStockQuery({
      ids: request.nextUrl.searchParams.get("ids") ?? "",
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 },
      );
    }

    const items = await getItemsStockByIds(result.output.ids);

    return NextResponse.json({ items });
  } catch (error) {
    return handleRouteHandlerError(error);
  }
}
