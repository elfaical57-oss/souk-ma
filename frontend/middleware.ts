import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Tags every request with the resolved locale so the root layout can set
// <html lang>/<html dir> correctly via headers() without each layout/page
// having to re-derive it from the pathname itself. Phase 1 only mirrors the
// homepage, so this is an exact match — extend this check as more routes
// get an /ar equivalent.
export function middleware(request: NextRequest) {
  const isAr = request.nextUrl.pathname === "/ar";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", isAr ? "ar" : "fr");
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?)$).*)",
  ],
};
