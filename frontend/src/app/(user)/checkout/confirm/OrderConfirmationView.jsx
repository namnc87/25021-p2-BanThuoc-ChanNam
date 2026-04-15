// OrderConfirmationView - Server Component
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import { CheckCircle, Package, CreditCard, AlertTriangle, Truck, Wallet, Landmark, ClipboardList } from 'lucide-react';

export default function OrderConfirmationView({ order }) {
  const getStatusText = (status) => {
    const map = {
      pending: 'Đang chờ xác nhận',
      processing: 'Đang xử lý',
      shipping: 'Đang giao hàng',
      delivered: 'Đã giao hàng',
      cancelled: 'Đã hủy'
    };
    return map[status] || status;
  };

  const getStatusColor = (status) => {
    const map = {
      pending: 'bg-amber-50 text-amber-700 border border-amber-200',
      processing: 'bg-sky-50 text-sky-700 border border-sky-200',
      shipping: 'bg-violet-50 text-violet-700 border border-violet-200',
      delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      cancelled: 'bg-red-50 text-red-700 border border-red-200'
    };
    return map[status] || 'bg-slate-50 text-slate-700 border border-slate-200';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getNumberValue = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 0;
    return Number(value);
  };

  const subtotal = getNumberValue(order.subtotal);
  const shippingCost = getNumberValue(order.shippingCost);
  const discount = getNumberValue(order.discount);
  const totalPrice = getNumberValue(order.totalPrice) || (subtotal + shippingCost - discount);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-10 border border-slate-100 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-100">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-emerald-600 mb-2">Đặt hàng thành công!</h1>
            <p className="text-slate-500">Cảm ơn bạn đã mua hàng tại PharmaHub</p>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <h3 className="font-semibold text-slate-500 text-sm mb-2">Mã đơn hàng</h3>
              <p className="text-lg font-extrabold text-sky-600">#{order.id}</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <h3 className="font-semibold text-slate-500 text-sm mb-2">Ngày đặt hàng</h3>
              <p className="text-slate-800 font-medium">{formatDate(order.createdAt)}</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <h3 className="font-semibold text-slate-500 text-sm mb-2">Trạng thái</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-gradient-to-r from-sky-50 to-indigo-50 p-7 rounded-2xl mb-8 border border-sky-100">
            <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
              <Truck className="w-5 h-5 text-sky-500" />
              Thông tin giao hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-slate-800">{order.recipientName || 'Không có thông tin'}</p>
                <p className="text-slate-500">{order.phone || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <p className="text-slate-500">{order.address || 'Chưa cập nhật địa chỉ'}</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-slate-50 p-7 rounded-2xl mb-8 border border-slate-100">
            <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-sky-500" />
              Phương thức thanh toán
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-md">
                {order.paymentMethod === 'cod' ? <Package className="w-6 h-6 text-white" /> : <CreditCard className="w-6 h-6 text-white" />}
              </div>
              <div>
                <p className="font-semibold text-slate-800">
                  {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}
                </p>
                <p className="text-slate-500 text-sm">
                  {order.paymentMethod === 'cod' ? 'Thanh toán bằng tiền mặt khi nhận hàng' : 'Chuyển khoản trước khi nhận hàng'}
                </p>
              </div>
            </div>

            {/* Bank Transfer Information */}
            {order.paymentMethod === 'bank_transfer' && (
              <div className="mt-5 bg-sky-50 border border-sky-200 rounded-2xl p-5">
                <h3 className="font-bold text-sky-800 mb-3 text-sm flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-sky-500" />
                  Thông tin tài khoản ngân hàng
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ngân hàng:</span>
                    <span className="font-medium text-slate-800">Vietcombank - PGD Quận 1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Số tài khoản:</span>
                    <span className="font-medium text-sky-600">1234567890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Chủ tài khoản:</span>
                    <span className="font-medium text-slate-800">Công ty TNHH PharmaHub</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nội dung CK:</span>
                    <span className="font-medium text-sky-600">{order.userName || 'Khách hàng'} - Thanh toan don hang #{order.id}</span>
                  </div>
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p className="text-xs">
                      Vui lòng chụp ảnh màn hình chuyển khoản và gửi đến hotline 1900 1234 để xác nhận thanh toán.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-5 text-slate-800 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-sky-500" />
              Chi tiết đơn hàng
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left py-4 px-5 text-xs font-semibold text-slate-500 uppercase">Sản phẩm</th>
                    <th className="text-center py-4 px-3 text-xs font-semibold text-slate-500 uppercase">Đơn vị</th>
                    <th className="text-center py-4 px-3 text-xs font-semibold text-slate-500 uppercase">SL</th>
                    <th className="text-right py-4 px-3 text-xs font-semibold text-slate-500 uppercase">Giá</th>
                    <th className="text-right py-4 px-5 text-xs font-semibold text-slate-500 uppercase">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, index) => (
                    <tr key={index} className="border-b border-slate-50">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                            <SafeImage
                              src={item.image || '/images/no-image.png'}
                              alt={item.productName}
                              width={48}
                              height={48}
                              className="w-12 h-12 object-cover rounded-xl"
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-800">{item.productName}</span>
                        </div>
                      </td>
                      <td className="text-center py-4 px-3 text-sm text-slate-500">{item.unit}</td>
                      <td className="text-center py-4 px-3 text-sm text-slate-800 font-medium">{item.quantity}</td>
                      <td className="text-right py-4 px-3 text-sm text-slate-500">{formatCurrency(item.price)}</td>
                      <td className="text-right py-4 px-5 text-sm font-semibold text-slate-800">
                        {formatCurrency(getNumberValue(item.price) * getNumberValue(item.quantity))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-slate-50 p-7 rounded-2xl mb-8 border border-slate-100">
            <div className="flex justify-end">
              <div className="w-full max-w-xs">
                <div className="flex justify-between py-2 text-sm text-slate-600">
                  <span>Tạm tính:</span>
                  <span className="font-medium text-slate-800">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between py-2 text-sm text-slate-600">
                  <span>Phí vận chuyển:</span>
                  <span className="font-medium text-slate-800">{formatCurrency(shippingCost)}</span>
                </div>
                <div className="flex justify-between py-2 text-sm text-slate-600">
                  <span>Giảm giá:</span>
                  <span className="text-red-500 font-medium">-{formatCurrency(discount)}</span>
                </div>
                <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between font-bold text-lg">
                  <span className="text-slate-800">Tổng cộng:</span>
                  <span className="text-emerald-600">{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/account"
              className="px-8 py-3.5 bg-gradient-to-r from-sky-500 to-sky-600 text-white text-center rounded-xl hover:from-sky-600 hover:to-sky-700 font-medium text-sm shadow-md shadow-sky-100"
            >
              Xem tài khoản của tôi
            </Link>
            <Link
              href="/"
              className="px-8 py-3.5 bg-slate-100 text-slate-600 text-center rounded-xl hover:bg-slate-200 font-medium text-sm border border-slate-200"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
