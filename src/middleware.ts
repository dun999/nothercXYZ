import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const isDocsSubdomain =
    hostname.startsWith("docs.") ||
    hostname === "docs.notherc.xyz";

  if (isDocsSubdomain) {
    const { pathname } = request.nextUrl;
    // Already on /docs path — don't rewrite to avoid loop
    if (pathname.startsWith("/docs")) {
      return NextResponse.next();
    }
    // Rewrite root to /docs
    const url = request.nextUrl.clone();
    url.pathname = `/docs${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
