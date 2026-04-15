// OrdersList - Server Component
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function OrdersList({ orders }) {
  const getStatusText = (status) => {
    const map = {
      pending: 'Đang chờ',
      processing: 'Đang xử lý',
      shipping: 'Đang giao',
      delivered: 'Đã giao',
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
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-800 mb-2">Chưa có đơn hàng</h3>
        <p className="text-slate-500 mb-5">Bạn chưa có đơn hàng nào trong lịch sử mua hàng</p>
        <Link
          href="/products"
          className="inline-block bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 py-2.5 rounded-xl hover:from-sky-600 hover:to-sky-700 font-medium text-sm shadow-sm shadow-sky-100"
        >
          Mua sắm ngay →
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Mã đơn hàng
            </th>
            <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Ngày đặt
            </th>
            <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tổng tiền
            </th>
            <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-slate-50 hover:bg-sky-50/30">
              <td className="px-5 py-4 whitespace-nowrap text-sm font-semibold text-sky-600">
                #{order.id}
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-500">
                {formatDate(order.createdAt)}
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600">
                {formatCurrency(order.totalPrice)}
              </td>
              <td className="px-5 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-sm">
                <Link
                  href={`/account/orders/${order.id}`}
                  className="text-sky-600 hover:text-sky-700 font-medium"
                >
                  Chi tiết →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
