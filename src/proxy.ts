import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/server";
import { isAdminRole } from "@/utils/is-admin-role";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const signInUrl = new URL("/sign-in", request.url);
    const callbackPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;

    signInUrl.searchParams.set("callbackUrl", callbackPath);

    return NextResponse.redirect(signInUrl);
  }

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !isAdminRole(session.user.role)
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/admin/:path*"],
};
