// OrderConfirmationView - Client Component
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function OrderConfirmationView({ order }) {
  const [imageError, setImageError] = useState(false);
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
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipping: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return map[status] || 'bg-gray-100 text-gray-800';
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">Đặt hàng thành công!</h1>
            <p className="text-gray-600">Cảm ơn bạn đã mua hàng tại PharmaHub</p>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Mã đơn hàng</h3>
              <p className="text-lg font-bold text-blue-600">#{order.id}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Ngày đặt hàng</h3>
              <p className="text-gray-800">{formatDate(order.createdAt)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Trạng thái</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Thông tin giao hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">{order.recipientName || 'Không có thông tin'}</p>
                <p className="text-gray-600">{order.phone || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <p className="text-gray-600">{order.address || 'Chưa cập nhật địa chỉ'}</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Phương thức thanh toán</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                {order.paymentMethod === 'cod' ? '📦' : '💳'}
              </div>
              <div>
                <p className="font-semibold">
                  {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}
                </p>
                <p className="text-gray-600 text-sm">
                  {order.paymentMethod === 'cod' ? 'Thanh toán bằng tiền mặt khi nhận hàng' : 'Chuyển khoản trước khi nhận hàng'}
                </p>
              </div>
            </div>

            {/* Bank Transfer Information */}
            {order.paymentMethod === 'bank_transfer' && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-800 mb-3">Thông tin tài khoản ngân hàng</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngân hàng:</span>
                    <span className="font-medium">Vietcombank - PGD Quận 1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tài khoản:</span>
                    <span className="font-medium text-blue-600">1234567890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chủ tài khoản:</span>
                    <span className="font-medium">Công ty TNHH PharmaHub</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nội dung chuyển khoản:</span>
                    <span className="font-medium text-blue-600">{order.userName || 'Khách hàng'} - Thanh toan don hang #{order.id}</span>
                  </div>
                  <div className="mt-3 p-2 bg-yellow-100 border border-yellow-200 rounded text-yellow-800">
                    <p className="text-xs">
                      ⚠️ Vui lòng chụp ảnh màn hình chuyển khoản và gửi đến hotline 1900 1234 để xác nhận thanh toán.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Chi tiết đơn hàng</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Sản phẩm</th>
                    <th className="text-center py-3">Đơn vị</th>
                    <th className="text-center py-3">Số lượng</th>
                    <th className="text-right py-3">Giá</th>
                    <th className="text-right py-3">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, index) => {
                    const itemImageError = imageError && item.image === order.items[index]?.image;
                    return (
                    <tr key={index} className="border-b">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={itemImageError || !item.image ? '/images/no-image.png' : item.image}
                            alt={item.productName}
                            className="w-12 h-12 object-cover rounded"
                            onError={() => setImageError(true)}
                          />
                          <span>{item.productName}</span>
                        </div>
                      </td>
                      <td className="text-center py-3">{item.unit}</td>
                      <td className="text-center py-3">{item.quantity}</td>
                      <td className="text-right py-3">{formatCurrency(item.price)}</td>
                      <td className="text-right py-3 font-semibold">
                        {formatCurrency(getNumberValue(item.price) * getNumberValue(item.quantity))}
                      </td>
                    </tr>
                  );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <div className="flex justify-end">
              <div className="w-full max-w-xs">
                <div className="flex justify-between py-2">
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Phí vận chuyển:</span>
                  <span>{formatCurrency(shippingCost)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Giảm giá:</span>
                  <span className="text-red-600">-{formatCurrency(discount)}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                  <span>Tổng cộng:</span>
                  <span className="text-green-600">{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/account"
              className="px-6 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
            >
              Xem tài khoản của tôi
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-200 text-gray-800 text-center rounded-lg hover:bg-gray-300 transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
