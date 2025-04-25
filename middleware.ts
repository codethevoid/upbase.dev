import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const protectedRoutes = ["/storage", "/api-keys", "/settings", "/profile"];
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

export const middleware = async (req: NextRequest) => {
  const path = req.nextUrl.pathname;
  const host = req.headers.get("host");

  if (host === "api.restash.io") {
    // rewrite to the API route
    const searchParams = req.nextUrl.searchParams;
    const searchParamsString = searchParams.toString() === "" ? "" : `?${searchParams.toString()}`;
    const fullPath = `${path === "/" ? "" : path}${searchParamsString}`;
    return NextResponse.rewrite(new URL(`/api${fullPath}`, req.url));
  }

  if (protectedRoutes.find((p) => path.startsWith(p))) {
    const token = await auth();
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    return NextResponse.next();
  }

  if (authRoutes.includes(path)) {
    const token = await auth();
    if (token) return NextResponse.redirect(new URL("/storage", req.url));
    return NextResponse.next();
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static storage)
     * - _next/image (image optimization storage)
     * - favicon.ico, sitemap.xml, robots.txt (metadata storage)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
