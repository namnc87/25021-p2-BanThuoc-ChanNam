// AccountLayout - Server Component
import Link from 'next/link';
import { checkAuth } from '@/actions/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AccountLayout({ children }) {
  const user = await checkAuth();

  if (!user) {
    redirect('/login?redirect=/account');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Tài khoản của tôi</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow p-6">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-bold">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <Link
                  href="/account/profile"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Thông tin cá nhân
                </Link>
                <Link
                  href="/account/orders"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Đơn hàng của tôi
                </Link>
                <Link
                  href="/account/addresses"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Địa chỉ giao hàng
                </Link>
                <hr className="my-2" />
                <Link
                  href="/"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                >
                  Tiếp tục mua sắm
                </Link>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
