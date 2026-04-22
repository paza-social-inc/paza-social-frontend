import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PLACEHOLDER_SECRETS = new Set(["your-jwt-secret-here", "your_jwt_secret_here"]);
const SECRET = process.env.JWT_SECRET ?? "";
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
    if (!SECRET) {
      console.warn("JWT_SECRET is unset; cookie JWT verification will fail.");
    } else if (PLACEHOLDER_SECRETS.has(SECRET)) {
      console.warn(
        "Middleware JWT_SECRET is still a placeholder. Tokens must be signed with the same secret; use a strong value in dev/prod and match Pbbackend-v1 JWT_SECRET.",
      );
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
