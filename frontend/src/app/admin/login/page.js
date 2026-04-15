// Admin Login Page - Server Component
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminLoginForm from "./AdminLoginForm";
import { Shield, Lock } from 'lucide-react';

export default async function AdminLoginPage({ searchParams }) {
  const sp = await searchParams;

  // Check if already logged in as admin
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  let user = null;

  if (token) {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const authPath = API_URL.endsWith("/api") ? "/auth/me" : "/api/auth/me";
      const res = await fetch(`${API_URL}${authPath}`, {
        headers: {
          cookie: `access_token=${token}`,
        },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        user = data.user;
      }
    } catch (error) {
      // Continue to show login form
    }
  }

  if (user) {
    if (user.role === "admin") {
      redirect(sp.redirect || "/admin/orders");
    }
    
    redirect("/?error=admin_blocked");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-rose-900">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 animate-scale-in">
        <div className="text-center mb-7">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-200">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Đăng nhập Quản trị
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Chỉ dành cho quản trị viên PharmaHub
          </p>
        </div>

        {sp.redirect && (
          <div className="bg-sky-50 text-sky-700 p-3.5 rounded-xl mb-5 text-sm font-medium border border-sky-100 flex items-center gap-2">
            <Lock className="w-4 h-4 flex-shrink-0" />
            Vui lòng đăng nhập để truy cập trang quản trị
          </div>
        )}

        <AdminLoginForm redirectTo={sp.redirect || '/admin/orders'} />

        <div className="mt-7 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center">
            Vui lòng sử dụng tài khoản quản trị được cấp phép.
          </p>
        </div>
      </div>
    </div>
  );
}
