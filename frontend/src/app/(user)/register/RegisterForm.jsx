// RegisterForm - Client Component for form interaction
'use client';

import { useActionState } from 'react';
import { registerAction } from '@/actions/auth';
import Link from 'next/link';
import { AlertTriangle, Loader2 } from 'lucide-react';

const initialState = {
  success: false,
  message: '',
  errors: {},
};

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state?.message && !state.success && (
        <div className="bg-red-50 text-red-700 p-3.5 rounded-xl border border-red-100 text-sm font-medium">
          <span className="font-semibold">Lỗi: </span>{state.message}
        </div>
      )}

      <div>
        <label htmlFor="fullname" className="block mb-1.5 font-medium text-sm text-slate-700">Họ và tên *</label>
        <input
          type="text"
          id="fullname"
          name="fullname"
          className={`w-full p-3.5 border rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent ${state?.errors?.fullname ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
          placeholder="Nhập họ và tên"
          disabled={isPending}
        />
        {state?.errors?.fullname && (
          <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> {state.errors.fullname}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block mb-1.5 font-medium text-sm text-slate-700">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          className={`w-full p-3.5 border rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent ${state?.errors?.email ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
          placeholder="example@email.com"
          disabled={isPending}
        />
        {state?.errors?.email && (
          <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> {state.errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block mb-1.5 font-medium text-sm text-slate-700">Số điện thoại *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className={`w-full p-3.5 border rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent ${state?.errors?.phone ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
          placeholder="0901234567"
          disabled={isPending}
        />
        {state?.errors?.phone && (
          <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> {state.errors.phone}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block mb-1.5 font-medium text-sm text-slate-700">Mật khẩu *</label>
        <input
          type="password"
          id="password"
          name="password"
          className={`w-full p-3.5 border rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent ${state?.errors?.password ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
          placeholder="Ít nhất 6 ký tự"
          disabled={isPending}
        />
        {state?.errors?.password && (
          <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> {state.errors.password}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block mb-1.5 font-medium text-sm text-slate-700">Nhập lại mật khẩu *</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className={`w-full p-3.5 border rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent ${state?.errors?.confirmPassword ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
          placeholder="Nhập lại mật khẩu"
          disabled={isPending}
        />
        {state?.errors?.confirmPassword && (
          <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> {state.errors.confirmPassword}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={`w-full py-3.5 rounded-xl font-bold text-white text-sm ${
          isPending
            ? 'bg-slate-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 shadow-md shadow-sky-100 hover:shadow-lg hover:shadow-sky-200'
        }`}
      >
        {isPending ? (
          <span className="flex items-center justify-center">
            <Loader2 className="animate-spin h-5 w-5 mr-2 text-white" />
            Đang xử lý...
          </span>
        ) : 'Đăng ký'}
      </button>
    </form>
  );
}
