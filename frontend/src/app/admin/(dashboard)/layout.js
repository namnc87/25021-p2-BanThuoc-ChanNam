// Admin Dashboard Layout - Server Component
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { logoutAction } from '@/actions/auth';
import { ClipboardList } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function checkAdminAccess() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const authPath = API_URL.endsWith('/api') ? '/auth/me' : '/api/auth/me';
    const res = await fetch(`${API_URL}${authPath}`, {
      headers: {
        cookie: `access_token=${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) redirect('/admin/login');

    const data = await res.json();
    if (data.user?.role !== 'admin') redirect('/admin/login');

    return data.user;
  } catch (error) {
    redirect('/admin/login');
  }
}

async function adminLogout() {
  'use server';
  try {
    const cookieStore = await cookies();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const logoutPath = API_URL.endsWith('/api') ? '/auth/logout' : '/api/auth/logout';
    const token = cookieStore.get('access_token')?.value;

    await fetch(`${API_URL}${logoutPath}`, {
      method: 'POST',
      headers: {
        cookie: `access_token=${token}`,
      },
    });
  } catch (error) {
    console.error('Logout failed:', error);
  }

  // Clear cookies
  const cookieStore = await cookies();
  cookieStore.delete('access_token');

  redirect('/admin/login');
}

export default async function AdminDashboardLayout({ children }) {
  const user = await checkAdminAccess();

  // Tabs ngang
  const tabs = [
    { id: 'orders', label: 'Đơn hàng', href: '/admin/orders', icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/20 to-slate-100">
      {/* Header Admin */}
      <header className="glass sticky top-0 z-50 shadow-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo và Tabs */}
            <div className="flex items-center">
              <Link href="/admin/orders" className="flex items-center">
                <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center mr-3 shadow-md shadow-red-100">
                  <span className="text-white font-bold text-sm">PH</span>
                </div>
                <h1 className="text-xl font-extrabold text-slate-800 hidden md:block">
                  PharmaHub <span className="text-red-500">Admin</span>
                </h1>
              </Link>

              {/* Tabs ngang */}
              <nav className="ml-8 hidden lg:flex space-x-1">
                {tabs.map((tab) => {
                  const TabIcon = tab.icon;
                  return (
                    <Link
                      key={tab.id}
                      href={tab.href}
                      className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 ${
                        tab.id === 'orders'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                      }`}
                    >
                      <TabIcon className="w-4 h-4" />
                      {tab.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* User info và logout */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-sm text-slate-800">{user?.name || 'Admin'}</p>
                <p className="text-xs text-slate-500">Quản trị viên</p>
              </div>

              {/* Logout form - Server Action */}
              <form action={adminLogout}>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl font-medium border border-transparent hover:border-red-100"
                >
                  Đăng xuất
                </button>
              </form>
            </div>
          </div>

          {/* Tabs ngang cho mobile/tablet */}
          <div className="lg:hidden border-t border-slate-100 mt-2 pt-2">
            <nav className="flex space-x-1 overflow-x-auto pb-2">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={`px-4 py-2 rounded-xl text-xs whitespace-nowrap font-medium flex items-center gap-1.5 ${
                      tab.id === 'orders'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
