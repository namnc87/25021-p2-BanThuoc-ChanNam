// Order Detail Page - Client Component
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOrderById } from '@/actions/orders';
import Link from 'next/link';

export default function OrderDetailPage({ params }) {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    async function fetchOrder() {
      try {
        const { id } = await params;
        const data = await getOrderById(id);
        if (data) {
          setOrder(data);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [params]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Đang tải...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl text-red-600">Không tìm thấy đơn hàng</h1>
        <Link href="/account/orders" className="text-blue-600 hover:underline">
          ← Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

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
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
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
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.id}</h1>
          <Link
            href="/account/orders"
            className="text-blue-600 hover:underline"
          >
            ← Quay lại danh sách
          </Link>
        </div>

        {/* Order Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-bold mb-3">Thông tin giao hàng</h3>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">Người nhận:</span> {order.recipientName}</p>
                <p><span className="font-medium">Số điện thoại:</span> {order.phone}</p>
                <p><span className="font-medium">Địa chỉ:</span> {order.address}</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-3">Thông tin đơn hàng</h3>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">Ngày đặt:</span> {formatDate(order.createdAt)}</p>
                <p><span className="font-medium">Phương thức thanh toán:</span> {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}</p>
                <p>
                  <span className="font-medium">Trạng thái:</span>{' '}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <h3 className="font-bold mb-3">Sản phẩm đã đặt</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4">Sản phẩm</th>
                  <th className="text-center py-3 px-4">Đơn vị</th>
                  <th className="text-center py-3 px-4">Số lượng</th>
                  <th className="text-right py-3 px-4">Đơn giá</th>
                  <th className="text-right py-3 px-4">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, index) => {
                  // Handle different image field names (image, productImage)
                  const itemImage = item.image || item.productImage || '/images/no-image.png';
                  return (
                  <tr key={index} className="border-t">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={imageErrors[index] ? '/images/no-image.png' : itemImage}
                          alt={item.productName || item.name || 'Sản phẩm'}
                          className="w-12 h-12 object-cover rounded"
                          onError={() => setImageErrors(prev => ({ ...prev, [index]: true }))}
                        />
                        <span>{item.productName || item.name || 'Không rõ tên'}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">{item.unit}</td>
                    <td className="text-center py-3 px-4">{item.quantity}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(item.price)}</td>
                    <td className="text-right py-3 px-4 font-semibold">
                      {formatCurrency(getNumberValue(item.price) * getNumberValue(item.quantity))}
                    </td>
                  </tr>
                );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex justify-end mt-6">
            <div className="w-full max-w-xs">
              <div className="flex justify-between py-2">
                <span>Tạm tính:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Phí vận chuyển:</span>
                <span>{formatCurrency(shippingCost)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between py-2">
                  <span>Giảm giá:</span>
                  <span className="text-red-600">-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                <span>Tổng cộng:</span>
                <span className="text-green-600">{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to shopping */}
        <div className="mt-6">
          <button
            onClick={() => {
              router.refresh();
              router.push('/products');
            }}
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
}
