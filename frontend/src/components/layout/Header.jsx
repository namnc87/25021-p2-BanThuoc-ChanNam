// Header - Server Component
import Link from 'next/link';
import { checkAuth, logoutAction } from '@/actions/auth';
import { getCartSummary } from '@/actions/cart';
import HeaderClient from './HeaderClient';
import { headers } from 'next/headers';
import { ShoppingCart, Pill } from 'lucide-react';

function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

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

  const { count: cartCount, total: cartTotal } = await getCartSummary();

  return (
    <header className="glass sticky top-0 z-50 shadow-md border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold gradient-text tracking-tight hover:opacity-80">
              <Pill className="w-7 h-7 text-sky-500" />
              PharmaHub
            </Link>
          </div>

          {/* Search Bar */}
          <HeaderClient />

          {/* Navigation */}
          <nav className="flex items-center gap-3">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-sky-600 px-2 py-1.5 rounded-full hover:bg-sky-50">
              Trang chủ
            </Link>
            <Link href="/products" className="text-sm font-medium text-slate-600 hover:text-sky-600 px-2 py-1.5 rounded-full hover:bg-sky-50">
              Sản phẩm
            </Link>
            <Link href="/#contact" className="text-sm font-medium text-slate-600 hover:text-sky-600 px-2 py-1.5 rounded-full hover:bg-sky-50">
              Liên hệ
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={isAdmin ? '/admin/orders' : '/account'}
                  className="bg-gradient-to-r from-sky-50 to-emerald-50 text-sky-700 px-4 py-2 rounded-full hover:from-sky-100 hover:to-emerald-100 flex items-center gap-2 text-sm font-medium border border-sky-100"
                >
                  <span>{user.name}</span>
                  {isAdmin && (
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                      Admin
                    </span>
                  )}
                </Link>

                {/* Logout form - Server Action */}
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full hover:bg-red-50 hover:text-red-600 text-sm font-medium border border-slate-200 hover:border-red-200"
                  >
                    Đăng xuất
                  </button>
                </form>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-sky-600 px-3 py-1.5 rounded-full hover:bg-sky-50">
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-5 py-2 rounded-full hover:from-sky-600 hover:to-sky-700 text-sm font-medium shadow-md shadow-sky-200 hover:shadow-lg hover:shadow-sky-300"
                >
                  Đăng ký
                </Link>
              </>
            )}

            {/* Cart - Only show for non-admin users */}
            {!isAdmin && (
              <Link href="/cart" className="relative flex items-center gap-2 text-slate-600 hover:text-sky-600 bg-slate-50 hover:bg-sky-50 px-3 py-2 rounded-full border border-slate-200 hover:border-sky-200">
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                {cartTotal > 0 && (
                  <span className="text-xs font-bold text-emerald-600 whitespace-nowrap">{formatCurrency(cartTotal)}</span>
                )}
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
