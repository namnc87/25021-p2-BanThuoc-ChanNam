// LoginForm - Client Component for form interaction
'use client';

import { useActionState, useEffect } from 'react';
import { loginAction } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const initialState = {
  success: false,
  message: '',
};

export default function LoginForm({ redirectTo = '/' }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  // Redirect on success
  useEffect(() => {
    if (state?.success && state.redirect) {
      router.push(state.redirect);
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      {state?.message && !state.success && (
        <div className="bg-red-50 text-red-700 p-3.5 rounded-xl mb-4 text-sm font-medium border border-red-100">
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-slate-50 focus:bg-white text-sm"
          placeholder="email@example.com"
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
          className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-slate-50 focus:bg-white text-sm"
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
            : 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 shadow-md shadow-sky-100 hover:shadow-lg hover:shadow-sky-200'
        }`}
      >
        {isPending ? (
          <span className="flex items-center justify-center">
            <Loader2 className="animate-spin h-5 w-5 mr-2 text-white" />
            Đang đăng nhập...
          </span>
        ) : (
          'Đăng nhập'
        )}
      </button>
    </form>
  );
}
