import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SECRET = process.env.JWT_SECRET!;

export async function middleware(req: NextRequest) {
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

// protected routes
export const config = {
  matcher: [],
};
