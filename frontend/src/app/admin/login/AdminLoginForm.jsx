// AdminLoginForm - Client Component for form interaction
'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminLoginAction } from '@/actions/auth';
import { Loader2 } from 'lucide-react';

const initialState = {
  success: false,
  message: '',
};

export default function AdminLoginForm({ redirectTo = '/admin/orders' }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(adminLoginAction, initialState);

  useEffect(() => {
    if (state?.success && state?.redirect) {
      router.push(state.redirect);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      {state?.message && (
        <div className="bg-red-50 text-red-700 p-3.5 rounded-xl mb-4 text-sm font-medium border border-red-100">
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
          Email quản trị
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent bg-slate-50 focus:bg-white text-sm"
          placeholder="admin@pharmahub.vn"
          required
          disabled={isPending}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Mật khẩu</label>
        <input
          type="password"
          id="password"
          name="password"
          className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent bg-slate-50 focus:bg-white text-sm"
          placeholder="••••••••"
          required
          disabled={isPending}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white text-sm ${
          isPending
            ? 'bg-slate-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-md shadow-red-100 hover:shadow-lg hover:shadow-red-200'
        }`}
      >
        {isPending ? (
          <span className="flex items-center justify-center">
            <Loader2 className="animate-spin h-5 w-5 mr-2 text-white" />
            Đang đăng nhập...
          </span>
        ) : (
          'Đăng nhập quản trị'
        )}
      </button>
    </form>
  );
}
