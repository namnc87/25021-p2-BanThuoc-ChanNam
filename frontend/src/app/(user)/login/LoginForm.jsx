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
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      {state?.message && !state.success && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="email@example.com"
          required
          disabled={isPending}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
        <input
          type="password"
          id="password"
          name="password"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="••••••••"
          required
          disabled={isPending}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
          isPending
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
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
