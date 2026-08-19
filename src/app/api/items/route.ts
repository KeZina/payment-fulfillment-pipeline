import { NextRequest, NextResponse } from "next/server";
import { parseItemsRouteQuery } from "@/schemas/items-route-query";
import { getItemsPage } from "@/lib/server/items";
import * as v from "valibot";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const result = parseItemsRouteQuery(
      Object.fromEntries(searchParams.entries()),
    );

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          issues: result.issues.map((issue) => ({
            field: v.getDotPath(issue) ?? "query",
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const page = await getItemsPage(result.output);

    return NextResponse.json(page);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
