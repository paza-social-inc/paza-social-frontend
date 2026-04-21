import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SECRET = process.env.JWT_SECRET!;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Define public routes that don't require authentication
  const isPublicRoute = 
    pathname === "/" ||
    pathname.startsWith("/login") || 
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/google") ||
    pathname.startsWith("/api");

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // verify jwt
    const decoded = jwt.verify(token, SECRET);

    // attach user info
    const response = NextResponse.next();
    response.headers.set("x-user", JSON.stringify(decoded));
    return response;
  } catch (err) {
    console.log("JWT verification failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (handled in code)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|.*\\..*).*)",
  ],
};
