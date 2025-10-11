import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Tách constants ra ngoài để dễ bảo trì
const PROTECTED_ROUTES = ["/dashboard"]
const AUTH_ROUTES = ["/login", "/register"]

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value // 👈 đồng bộ với LOCAL_KEYS

  const { pathname } = request.nextUrl

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  // Nếu vào route cần bảo vệ mà không có token → redirect login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname) // giữ redirect để login xong quay lại
    return NextResponse.redirect(loginUrl)
  }

  // Nếu vào login/register mà đã có token → redirect dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
}
