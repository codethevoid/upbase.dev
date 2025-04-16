import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/storage", "/api-keys", "/settings", "/profile"];
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

export const middleware = async (req: NextRequest) => {
  const path = req.nextUrl.pathname;

  if (protectedRoutes.find((p) => path.startsWith(p))) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
  }

  if (authRoutes.includes(path)) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    if (token) return NextResponse.redirect(new URL("/storage", req.url));
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
