import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const cookieStore = request.headers.get('cookie') || '';

  // Check static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Set pathname header for Header component
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);

  // Public routes (no authentication required)
  const publicRoutes = [
    '/',
    '/home',
    '/login',
    '/register',
    '/products',
    '/admin/login',
  ];

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return response;
  }

  try {
    // Check authentication
    const authResponse = await fetch('http://localhost:4000/api/auth/me', {
      headers: { Cookie: cookieStore },
    });

    const data = authResponse.ok ? await authResponse.json() : null;
    const user = data?.user;
    const isAuthenticated = authResponse.ok && user;

    // Admin routes protection
    if (pathname.startsWith('/admin')) {
      if (!isAuthenticated) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (user.role !== 'admin') {
        const homeUrl = new URL('/', request.url);
        homeUrl.searchParams.set('error', 'Bạn không có quyền truy cập khu vực quản trị');
        return NextResponse.redirect(homeUrl);
      }

      return response;
    }

    // User protected routes - only cart, checkout, account require login
    const userProtectedRoutes = ['/cart', '/checkout', '/account'];
    const isUserProtectedRoute = userProtectedRoutes.some(
      route => pathname === route || pathname.startsWith(route + '/')
    );

    if (isUserProtectedRoute) {
      if (!isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
      return response;
    }

    // Allow all other routes without authentication
    return response;

  } catch (error) {
    console.error('Middleware error:', error);
    return response;
  }
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|public/).*)',
};
