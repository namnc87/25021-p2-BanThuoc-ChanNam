// AdminLoginForm - Client Component for form interaction
'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminLoginAction } from '@/actions/auth';

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
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      {state?.message && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email quản trị
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          placeholder="admin@pharmahub.vn"
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
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
            : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        {isPending ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang đăng nhập...
          </span>
        ) : (
          'Đăng nhập quản trị'
        )}
      </button>
    </form>
  );
}
