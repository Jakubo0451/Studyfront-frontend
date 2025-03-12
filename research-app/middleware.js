import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  console.log("Middleware running. Token:", token, "Path:", pathname);

  if (!token && pathname.startsWith("/dashboard")) {
    console.log("Redirecting to /auth/login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // Protect all dashboard pages
};
