import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SECRET = process.env.JWT_SECRET!;
const encodedSecret = new TextEncoder().encode(SECRET);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Define routes that REQUIRE authentication
  const isProtectedRoute = 
    pathname.startsWith("/overview") ||
    pathname.startsWith("/campaigns") ||
    pathname.startsWith("/tasks") ||
    pathname.startsWith("/inbox") ||
    pathname.startsWith("/jobs") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/payments") ||
    pathname.startsWith("/accounts") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/showcase") ||
    pathname.startsWith("/proposals") ||
    pathname.startsWith("/onboarding");

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Check if secret is still the placeholder
    if (SECRET === "your-jwt-secret-here") {
      console.warn("Middleware using placeholder JWT_SECRET. Verification will likely fail for production tokens.");
    }

    // verify jwt using jose (Edge compatible)
    const { payload } = await jwtVerify(token, encodedSecret);

    // attach user info
    const response = NextResponse.next();
    response.headers.set("x-user", JSON.stringify(payload));
    return response;
  } catch (err) {
    console.error("JWT verification failed:", err instanceof Error ? err.message : err);
    
    // Redirect to login if verification fails
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
