import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Simple check for /admin routes
  if (pathname.startsWith('/admin')) {
    const adminSecret = process.env.ADMIN_SECRET

    // If no secret is configured, allow access (for initial setup)
    if (!adminSecret) return NextResponse.next()

    const authCookie = request.cookies.get('admin_auth')?.value

    if (authCookie !== adminSecret) {
      // Redirect to login if not authenticated
      if (pathname !== '/admin/login') {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    } else if (pathname === '/admin/login') {
      // Already authenticated, redirect to dashboard
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
