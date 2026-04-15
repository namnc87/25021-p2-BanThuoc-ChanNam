// AccountLayout - Server Component
import Link from 'next/link';
import { checkAuth } from '@/actions/auth';
import { redirect } from 'next/navigation';
import { UserCircle, FileText, Package, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AccountLayout({ children }) {
  const user = await checkAuth();

  if (!user) {
    redirect('/login?redirect=/account');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-indigo-50/30">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-extrabold mb-7 text-slate-800 flex items-center gap-3">
          <UserCircle className="w-7 h-7 text-sky-500" />
          Tài khoản của tôi
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-bold text-slate-800">{user.name}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-1.5">
                <Link
                  href="/account/profile"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-700 text-slate-600 font-medium text-sm"
                >
                  <FileText className="w-4 h-4" />
                  Thông tin cá nhân
                </Link>
                <Link
                  href="/account/orders"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-700 text-slate-600 font-medium text-sm"
                >
                  <Package className="w-4 h-4" />
                  Đơn hàng của tôi
                </Link>
                <Link
                  href="/account/addresses"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-700 text-slate-600 font-medium text-sm"
                >
                  <MapPin className="w-4 h-4" />
                  Địa chỉ giao hàng
                </Link>
                <hr className="my-3 border-slate-100" />
                <Link
                  href="/"
                  className="block px-4 py-2.5 rounded-xl hover:bg-slate-100 text-slate-400 font-medium text-sm"
                >
                  ← Tiếp tục mua sắm
                </Link>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-100">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
