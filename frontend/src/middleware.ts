import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// NOTE: Middleware này xử lý routing dựa trên cookies để redirect user về đúng trang
// Cookies được set từ client-side sau khi đăng nhập thành công
export function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl
  
  // // Lấy auth info từ cookies (được set từ client-side)
  // const hasAuth = request.cookies.has('hasAuth')
  // const userRole = request.cookies.get('userRole')?.value
  
  // // Root path "/" - redirect dựa trên auth status
  // if (pathname === '/') {
  //   if (hasAuth && userRole) {
  //     // Đã đăng nhập, redirect về dashboard tương ứng role
  //     if (userRole === 'admin') {
  //       return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  //     } else if (userRole === 'tutor') {
  //       return NextResponse.redirect(new URL('/tutor/dashboard', request.url))
  //     } else {
  //       return NextResponse.redirect(new URL('/student/dashboard', request.url))
  //     }
  //   } else {
  //     // Chưa đăng nhập, redirect về login
  //     return NextResponse.redirect(new URL('/auth/login', request.url))
  //   }
  // }
  
  // // Protected routes - yêu cầu authentication
  // const protectedPaths = ['/student', '/tutor', '/admin', '/dashboard']
  // const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path))
  
  // if (isProtectedRoute && !hasAuth) {
  //   // Chưa đăng nhập, redirect về login
  //   return NextResponse.redirect(new URL('/auth/login', request.url))
  // }
  
  // // Auth routes - nếu đã đăng nhập thì redirect về dashboard
  // const authPaths = ['/auth/login', '/auth/register']
  // const isAuthRoute = authPaths.some(path => pathname.startsWith(path))
  
  // if (isAuthRoute && hasAuth && userRole) {
  //   // Đã đăng nhập rồi, redirect về dashboard tương ứng
  //   if (userRole === 'admin') {
  //     return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  //   } else if (userRole === 'tutor') {
  //     return NextResponse.redirect(new URL('/tutor/dashboard', request.url))
  //   } else {
  //     return NextResponse.redirect(new URL('/student/dashboard', request.url))
  //   }
  // }
  
  // // Role-based access control
  // if (pathname.startsWith('/admin') && userRole !== 'admin') {
  //   return NextResponse.redirect(new URL('/unauthorized', request.url))
  // }
  
  // if (pathname.startsWith('/tutor') && userRole !== 'tutor') {
  //   return NextResponse.redirect(new URL('/unauthorized', request.url))
  // }
  
  // if (pathname.startsWith('/student') && userRole !== 'student') {
  //   return NextResponse.redirect(new URL('/unauthorized', request.url))
  // }
  
  // return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/student/:path*',
    '/tutor/:path*',
    '/admin/:path*',
    '/auth/login',
    '/auth/register'
  ],
}
