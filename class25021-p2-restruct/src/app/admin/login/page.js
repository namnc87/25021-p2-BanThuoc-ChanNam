// Admin Login Page - Server Component
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminLoginForm from './AdminLoginForm';

export default async function AdminLoginPage({ searchParams }) {
  const sp = await searchParams;
  
  // Check if already logged in as admin
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (token) {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authPath = API_URL.endsWith('/api') ? '/auth/me' : '/api/auth/me';
      const res = await fetch(`${API_URL}${authPath}`, {
        headers: {
          cookie: `access_token=${token}`,
        },
        cache: 'no-store',
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user?.role === 'admin') {
          redirect('/admin/orders');
        }
      }
    } catch (error) {
      // Continue to show login form
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Đăng nhập Quản trị</h1>
          <p className="text-gray-600 text-sm">Chỉ dành cho quản trị viên PharmaHub</p>
        </div>

        {sp.redirect && (
          <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4 text-sm">
            Vui lòng đăng nhập để truy cập trang quản trị
          </div>
        )}

        <AdminLoginForm />

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Vui lòng sử dụng tài khoản quản trị được cấp phép.
          </p>
        </div>
      </div>
    </div>
  );
}
