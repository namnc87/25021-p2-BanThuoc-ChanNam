// RegisterForm - Client Component for form interaction
'use client';

import { useActionState } from 'react';
import { registerAction } from '@/actions/auth';
import Link from 'next/link';

const initialState = {
  success: false,
  message: '',
  errors: {},
};

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state?.message && !state.success && (
        <div className="bg-red-100 text-red-700 p-3 rounded border border-red-200">
          <span className="font-medium">Lỗi: </span>{state.message}
        </div>
      )}

      <div>
        <label htmlFor="fullname" className="block mb-1 font-medium">Họ và tên *</label>
        <input
          type="text"
          id="fullname"
          name="fullname"
          className={`w-full p-3 border rounded-lg ${state?.errors?.fullname ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          placeholder="Nhập họ và tên"
          disabled={isPending}
        />
        {state?.errors?.fullname && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <span className="mr-1">⚠</span> {state.errors.fullname}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block mb-1 font-medium">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          className={`w-full p-3 border rounded-lg ${state?.errors?.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          placeholder="example@email.com"
          disabled={isPending}
        />
        {state?.errors?.email && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <span className="mr-1">⚠</span> {state.errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block mb-1 font-medium">Số điện thoại *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className={`w-full p-3 border rounded-lg ${state?.errors?.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          placeholder="0901234567"
          disabled={isPending}
        />
        {state?.errors?.phone && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <span className="mr-1">⚠</span> {state.errors.phone}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block mb-1 font-medium">Mật khẩu *</label>
        <input
          type="password"
          id="password"
          name="password"
          className={`w-full p-3 border rounded-lg ${state?.errors?.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          placeholder="Ít nhất 6 ký tự"
          disabled={isPending}
        />
        {state?.errors?.password && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <span className="mr-1">⚠</span> {state.errors.password}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block mb-1 font-medium">Nhập lại mật khẩu *</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className={`w-full p-3 border rounded-lg ${state?.errors?.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          placeholder="Nhập lại mật khẩu"
          disabled={isPending}
        />
        {state?.errors?.confirmPassword && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <span className="mr-1">⚠</span> {state.errors.confirmPassword}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
          isPending
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isPending ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang xử lý...
          </span>
        ) : 'Đăng ký'}
      </button>
    </form>
  );
}
