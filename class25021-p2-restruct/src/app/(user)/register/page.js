// Register Page - Server Component
import Link from 'next/link';
import RegisterForm from './RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-2">Đăng ký tài khoản</h1>
        <p className="text-gray-600 text-center mb-8">Tạo tài khoản mới để mua thuốc trực tuyến</p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cột trái: Lợi ích */}
          <div className="lg:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Lợi ích khi tạo tài khoản</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="font-medium">Theo dõi đơn hàng và lịch sử mua sắm</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="font-medium">Nhận thông báo khuyến mãi sớm</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="font-medium">Lưu danh sách sản phẩm yêu thích</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="font-medium">Hỗ trợ khách hàng ưu tiên</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="font-medium">Đánh giá sản phẩm đã mua</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="font-medium">Lưu nhiều địa chỉ giao hàng</span>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-blue-800 mb-2">Ưu đãi đặc biệt</h3>
                <p className="text-blue-700 text-sm">
                  Đăng ký ngay để nhận <span className="font-bold">mã giảm giá 10%</span> cho đơn hàng đầu tiên!
                </p>
              </div>
            </div>
          </div>

          {/* Cột phải: Form */}
          <div className="lg:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow">
              <RegisterForm />

              <div className="text-center pt-4 border-t">
                <p className="text-gray-600">
                  Đã có tài khoản?{' '}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Đăng nhập ngay
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
