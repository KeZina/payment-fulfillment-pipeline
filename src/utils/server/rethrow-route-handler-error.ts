import { unstable_rethrow } from "next/navigation";
import { NextResponse } from "next/server";

export function handleRouteHandlerError(error: unknown) {
  unstable_rethrow(error);
  console.error(error);
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
