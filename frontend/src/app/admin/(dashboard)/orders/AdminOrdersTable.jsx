// AdminOrdersTable - Client Component for interactive admin features
'use client';

import React, { useState, useTransition } from 'react';
import { updateOrderStatusAction } from '@/actions/orders';
import { ClipboardList, User, Truck, Settings } from 'lucide-react';

export default function AdminOrdersTable({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState(null);
  const itemsPerPage = 10;

  const getStatusText = (status) => {
    const map = {
      pending: 'Chờ xác nhận',
      processing: 'Đang xử lý',
      shipping: 'Đang giao hàng',
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
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentMethod === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleUpdateStatus = (orderId, newStatus) => {
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, newStatus);
      if (result.success && result.order) {
        setOrders(prev => prev.map(order =>
          order.id === orderId ? result.order : order
        ));
        setMessage({ type: 'success', text: 'Cập nhật trạng thái thành công!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Cập nhật trạng thái thất bại' });
        setTimeout(() => setMessage(null), 3000);
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-100">
      {message && (
        <div className={`p-3.5 rounded-xl mx-6 mt-5 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-100">
        <div className="px-7 py-5">
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-sky-500" />
            Danh sách đơn hàng
          </h2>
          <p className="text-slate-500 mt-1 text-sm">Quản lý và cập nhật trạng thái đơn hàng</p>
        </div>
      </div>

      <div className="p-7">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-7">
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-5 rounded-2xl border border-sky-100">
            <div className="text-sky-600 font-extrabold text-2xl">{filteredOrders.length}</div>
            <div className="text-sky-800 font-medium text-sm mt-1">Tổng đơn hàng</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-5 rounded-2xl border border-amber-100">
            <div className="text-amber-600 font-extrabold text-2xl">
              {filteredOrders.filter(o => o.status === 'pending').length}
            </div>
            <div className="text-amber-800 font-medium text-sm mt-1">Chờ xác nhận</div>
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-5 rounded-2xl border border-violet-100">
            <div className="text-violet-600 font-extrabold text-2xl">
              {filteredOrders.filter(o => o.status === 'shipping').length}
            </div>
            <div className="text-violet-800 font-medium text-sm mt-1">Đang giao</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-100">
            <div className="text-emerald-600 font-extrabold text-2xl">
              {filteredOrders.filter(o => o.status === 'delivered').length}
            </div>
            <div className="text-emerald-800 font-medium text-sm mt-1">Đã giao</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-7 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn, tên, SĐT..."
            className="p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            className="p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-sm appearance-none"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipping">Đang giao hàng</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <select
            className="p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-sm appearance-none"
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả phương thức</option>
            <option value="cod">COD</option>
            <option value="bank_transfer">Chuyển khoản</option>
          </select>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setPaymentFilter('all');
              setCurrentPage(1);
            }}
            className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 font-medium text-sm border border-slate-200"
          >
            Xóa bộ lọc
          </button>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Mã đơn</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">SĐT</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">PT thanh toán</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày đặt</th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-sky-50/30">
                    <td className="px-5 py-4 font-semibold text-sky-600 text-sm">#{order.id}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">{order.recipientName || 'Không có'}</td>
                    <td className="px-5 py-4 text-sm text-slate-500">{order.phone || 'Không có'}</td>
                    <td className="px-5 py-4 text-emerald-600 font-semibold text-sm">{formatCurrency(order.totalPrice)}</td>
                    <td className="px-5 py-4">
                      {order.paymentMethod === 'cod' ? (
                        <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold border border-amber-200">COD</span>
                      ) : (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">CK</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(order.status || 'pending')}`}>
                        {getStatusText(order.status || 'pending')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                          expandedOrderId === order.id
                            ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-sm'
                            : 'bg-sky-50 text-sky-600 border border-sky-200 hover:bg-sky-100'
                        }`}
                      >
                        {expandedOrderId === order.id ? 'Đóng' : 'Chi tiết'}
                      </button>
                    </td>
                  </tr>
                  {expandedOrderId === order.id && (
                    <tr className="bg-slate-50/50">
                      <td colSpan="8" className="p-7">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                            <h4 className="font-bold mb-3 text-slate-800 text-sm flex items-center gap-2">
                              <User className="w-4 h-4 text-sky-500" />
                              Thông tin khách hàng
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p><span className="text-slate-500">Họ tên:</span> <span className="font-medium text-slate-800">{order.recipientName}</span></p>
                              <p><span className="text-slate-500">SĐT:</span> <span className="font-medium text-slate-800">{order.phone}</span></p>
                              <p><span className="text-slate-500">Email:</span> <span className="font-medium text-slate-800">{order.user?.email}</span></p>
                            </div>
                          </div>
                          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                            <h4 className="font-bold mb-3 text-slate-800 text-sm flex items-center gap-2">
                              <Truck className="w-4 h-4 text-sky-500" />
                              Thông tin giao hàng
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p><span className="text-slate-500">Địa chỉ:</span> <span className="font-medium text-slate-800">{order.address}</span></p>
                              <p><span className="text-slate-500">Ghi chú:</span> <span className="font-medium text-slate-800">{order.note || 'Không có'}</span></p>
                            </div>
                          </div>
                          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                            <h4 className="font-bold mb-3 text-slate-800 text-sm flex items-center gap-2">
                              <Settings className="w-4 h-4 text-sky-500" />
                              Cập nhật trạng thái
                            </h4>
                            <select
                              value={order.status || 'pending'}
                              onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                              disabled={isPending}
                              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-sm"
                            >
                              <option value="pending">Chờ xác nhận</option>
                              <option value="processing">Đang xử lý</option>
                              <option value="shipping">Đang giao hàng</option>
                              <option value="delivered">Đã giao</option>
                              <option value="cancelled">Đã hủy</option>
                            </select>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center text-slate-400">
                    Không tìm thấy đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-7 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-2.5 border border-slate-200 rounded-xl disabled:opacity-50 bg-white hover:bg-sky-50 hover:border-sky-200 text-sm"
            >
              ←
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2.5 border rounded-xl text-sm font-medium ${currentPage === i + 1 ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white border-sky-500 shadow-md shadow-sky-100' : 'border-slate-200 hover:bg-sky-50 hover:border-sky-200 bg-white'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-2.5 border border-slate-200 rounded-xl disabled:opacity-50 bg-white hover:bg-sky-50 hover:border-sky-200 text-sm"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
