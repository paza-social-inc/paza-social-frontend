import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// const PLACEHOLDER_SECRETS = new Set([
//   "your-jwt-secret-here",
//   "your_jwt_secret_here",
// ]);

const SECRET = process.env.JWT_SECRET ?? "";

const encodedSecret =
  new TextEncoder().encode(SECRET);

export async function middleware(
  req: NextRequest
) {

  const { pathname } = req.nextUrl;

  /**
   * NORMAL USER ROUTES
   */

  const isProtectedUserRoute =
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

  /**
   * ADMIN ROUTES
   */

  const isAdminLoginPage =
    pathname === "/admin/log-in";

  const isAdminRoute =
    pathname.startsWith("/admin") &&
    !isAdminLoginPage;

  /**
   * PUBLIC ROUTES
   */

  if (
    !isProtectedUserRoute &&
    !isAdminRoute
  ) {
    return NextResponse.next();
  }

  /**
   * USER TOKEN
   */

  if (isProtectedUserRoute) {

    const token =
      req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }

    try {

      await jwtVerify(
        token,
        encodedSecret
      );

      return NextResponse.next();

    } catch (err) {

      console.error(
        "User JWT verification failed:",
        err instanceof Error
          ? err.message
          : err
      );

      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }
  }

  /**
   * ADMIN TOKEN
   */

  if (isAdminRoute) {

    const adminToken =
      req.cookies.get("admin_token")?.value;

    /**
     * NO ADMIN TOKEN
     */

    if (!adminToken) {

      return NextResponse.redirect(
        new URL("/admin/log-in", req.url)
      );
    }

    try {

      const { payload } =
        await jwtVerify(
          adminToken,
          encodedSecret
        );

      /**
       * STRICT ADMIN ROLE CHECK
       */

      if (
        payload.role !== "super_admin"
      ) {

        return NextResponse.redirect(
          new URL("/admin/log-in", req.url)
        );
      }

      return NextResponse.next();

    } catch (err) {

      console.error(
        "Admin JWT verification failed:",
        err
      );

      return NextResponse.redirect(
        new URL("/admin/log-in", req.url)
      );
    }
  }

  return NextResponse.next();
}

/**
 * MATCHER
 */

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|icon.jpeg|public|.*\\..*).*)",
  ],
};