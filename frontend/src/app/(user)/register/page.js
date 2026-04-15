// Register Page - Server Component
import Link from 'next/link';
import RegisterForm from './RegisterForm';
import { Check, Gift } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 py-14">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-extrabold text-center mb-2 text-slate-800">Đăng ký tài khoản</h1>
        <p className="text-slate-500 text-center mb-10">Tạo tài khoản mới để mua thuốc trực tuyến</p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cột trái: Lợi ích */}
          <div className="lg:w-1/2">
            <div className="bg-white p-7 rounded-2xl shadow-md border border-slate-100">
              <h2 className="text-xl font-bold mb-5 text-slate-800">Lợi ích khi tạo tài khoản</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-medium text-slate-700">Theo dõi đơn hàng và lịch sử mua sắm</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-medium text-slate-700">Nhận thông báo khuyến mãi sớm</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-medium text-slate-700">Lưu danh sách sản phẩm yêu thích</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-medium text-slate-700">Hỗ trợ khách hàng ưu tiên</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-medium text-slate-700">Đánh giá sản phẩm đã mua</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-medium text-slate-700">Lưu nhiều địa chỉ giao hàng</span>
                </li>
              </ul>

              <div className="mt-7 p-5 bg-gradient-to-r from-sky-50 to-indigo-50 rounded-2xl border border-sky-100">
                <h3 className="font-bold text-sky-800 mb-2 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-sky-500" />
                  Ưu đãi đặc biệt
                </h3>
                <p className="text-sky-700 text-sm leading-relaxed">
                  Đăng ký ngay để nhận <span className="font-bold">mã giảm giá 10%</span> cho đơn hàng đầu tiên!
                </p>
              </div>
            </div>
          </div>

          {/* Cột phải: Form */}
          <div className="lg:w-1/2">
            <div className="bg-white p-7 rounded-2xl shadow-md border border-slate-100">
              <RegisterForm />

              <div className="text-center pt-5 border-t border-slate-100 mt-6">
                <p className="text-slate-500">
                  Đã có tài khoản?{' '}
                  <Link
                    href="/login"
                    className="text-sky-600 hover:text-sky-700 font-medium"
                  >
                    Đăng nhập ngay →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
