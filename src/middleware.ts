import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminSession = request.cookies.get('admin_session');

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!adminSession || adminSession.value !== 'authenticated') {
      const url = new URL('/admin/login', request.url);
      return NextResponse.redirect(url);
    }
  }

  // Redirect /admin/login to /admin if already authenticated
  if (pathname === '/admin/login') {
    if (adminSession && adminSession.value === 'authenticated') {
      const url = new URL('/admin', request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
