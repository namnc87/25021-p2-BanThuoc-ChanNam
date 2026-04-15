// Login Page - Server Component
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LoginForm from './LoginForm';
import { User, CheckCircle, LogOut } from 'lucide-react';

export default async function LoginPage({ searchParams }) {
  const sp = await searchParams;

  // Check if already logged in
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  let user = null;

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
        user = data.user;
      }
    } catch (error) {
      // Continue to show login form
      console.log(error)
    }
  }

  if (user) {
    // Block admin users from customer login page
    if (user.role === 'admin') {
      redirect('/?error=admin_blocked');
    }
    redirect('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 animate-fade-in">
        <div className="text-center mb-7">
          <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-100">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Đăng nhập</h1>
          <p className="text-slate-500 text-sm mt-1">Đăng nhập vào tài khoản khách hàng</p>
        </div>

        {sp.registered && (
          <div className="bg-emerald-50 text-emerald-700 p-3.5 rounded-xl mb-5 text-sm font-medium border border-emerald-100 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            Đăng ký thành công! Vui lòng đăng nhập.
          </div>
        )}

        {sp.logout && (
          <div className="bg-sky-50 text-sky-700 p-3.5 rounded-xl mb-5 text-sm font-medium border border-sky-100 flex items-center gap-2">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Bạn đã đăng xuất thành công.
          </div>
        )}

        <LoginForm redirectTo={sp.redirect || '/'} />

        <div className="mt-7 text-center">
          <div className="mb-4">
            <Link href="/register" className="text-sky-600 hover:text-sky-700 text-sm font-medium">
              Chưa có tài khoản? Đăng ký →
            </Link>
          </div>
          <div>
            <Link href="/" className="text-slate-400 hover:text-slate-600 text-sm block mt-2">
              ← Quay lại trang chủ
            </Link>
          </div>
        </div>

        <div className="mt-7 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center">
            Sử dụng email và mật khẩu đã đăng ký để đăng nhập.
          </p>
        </div>
      </div>
    </div>
  );
}
