// Header - Server Component
import Link from 'next/link';
import { checkAuth, logoutAction } from '@/actions/auth';
import { getCartCount } from '@/actions/cart';
import HeaderClient from './HeaderClient';
import { headers } from 'next/headers';

export default async function Header() {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // No header for admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  const user = await checkAuth();
  const isAdmin = user?.role === 'admin';

  // No header for admin users
  if (isAdmin) {
    return null;
  }

  const cartCount = await getCartCount();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-800">
              PharmaHub
            </Link>
          </div>

          {/* Search Bar */}
          <HeaderClient />

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link href="/" className="hover:text-blue-600">
              Trang chủ
            </Link>
            <Link href="/products" className="hover:text-blue-600">
              Sản phẩm
            </Link>
            <Link href="/#contact" className="hover:text-blue-600">
              Liên hệ
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={isAdmin ? '/admin/orders' : '/account'}
                  className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-md hover:bg-blue-200 flex items-center gap-2"
                >
                  <span>{user.name}</span>
                  {isAdmin && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </Link>

                {/* Logout form - Server Action */}
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 hover:text-red-600 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </form>
              </div>
            ) : (
              <>
                <Link href="/login" className="hover:text-blue-600">
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-800 text-white px-3 py-1.5 rounded-md hover:bg-blue-700"
                >
                  Đăng ký
                </Link>
              </>
            )}

            {/* Cart - Only show for non-admin users */}
            {!isAdmin && (
              <Link href="/cart" className="relative hover:text-blue-600">
                <div className="relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
