// Login Page - Server Component
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LoginForm from './LoginForm';

export default async function LoginPage({ searchParams }) {
  const sp = await searchParams;

  // Check if already logged in
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
        if (data.user) {
          // Block admin users from customer login page
          if (data.user.role === 'admin') {
            redirect('/?error=admin_blocked');
          }
          redirect('/');
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
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Đăng nhập</h1>
          <p className="text-gray-600 text-sm">Đăng nhập vào tài khoản khách hàng</p>
        </div>

        {sp.registered && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
            Đăng ký thành công! Vui lòng đăng nhập.
          </div>
        )}

        {sp.logout && (
          <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4 text-sm">
            Bạn đã đăng xuất thành công.
          </div>
        )}

        <LoginForm />

        <div className="mt-6 text-center">
          <div className="mb-4">
            <Link href="/register" className="text-blue-600 hover:underline text-sm">
              Chưa có tài khoản? Đăng ký
            </Link>
          </div>
          <div>
            <Link href="/" className="text-gray-600 hover:underline text-sm block mt-2">
              ← Quay lại trang chủ
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Sử dụng email và mật khẩu đã đăng ký để đăng nhập.
          </p>
        </div>
      </div>
    </div>
  );
}
