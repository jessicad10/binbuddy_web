import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public and protected routes
const publicRoutes = ["/login", "/register"];
const protectedRoutes = ["/dashboard", "/profile"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // If trying to access a protected route and no token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    try {
      const userDataCookie = request.cookies.get("user_data")?.value;
      let user = null;
      if (userDataCookie) {
        try {
          user = JSON.parse(userDataCookie);
        } catch {
          user = JSON.parse(decodeURIComponent(userDataCookie));
        }
      }
      if (!user || user.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // If trying to access login/register and already logged in, redirect to dashboard
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Config to specify matching paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads).*)"],
};
