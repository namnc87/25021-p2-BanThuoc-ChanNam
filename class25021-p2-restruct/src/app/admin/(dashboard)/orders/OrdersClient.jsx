// frontend/src/app/admin/orders/OrdersClient.jsx
'use client';

import React, { useState } from 'react';
import { authFetch } from '@/lib/auth';

export default function OrdersClient({ orders: initialOrders, user }) {
  const [orders, setOrders] = useState(initialOrders);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
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
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border border-blue-200',
      shipping: 'bg-purple-100 text-purple-800 border border-purple-200',
      delivered: 'bg-green-100 text-green-800 border border-green-200',
      cancelled: 'bg-red-100 text-red-800 border border-red-200'
    };
    return map[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
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
    const orderId = order.id ? order.id.toString() : '';
    const recipientName = order.recipientName ? order.recipientName.toString() : '';
    const phone = order.phone ? order.phone.toString() : '';

    const matchesSearch = orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         phone.includes(searchTerm);

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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const ordersPath = API_URL.endsWith('/api') ? '/orders' : '/api/orders';
      const res = await authFetch(`${API_URL}${ordersPath}/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const response = await res.json();
        setOrders(prev => prev.map(order =>
          order.id === orderId ? response.order : order
        ));
      } else {
        const error = await res.json();
        alert(error.message || 'Cập nhật trạng thái thất bại');
      }
    } catch (error) {
      alert('Lỗi kết nối server');
    }
  };

  const toggleOrderDetail = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Hàm render chi tiết đơn hàng
  const renderOrderDetail = (order) => {
    if (expandedOrderId !== order.id) return null;

    return (
      <tr key={`${order.id}-detail`} className="bg-gray-50">
        <td colSpan="8" className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Thông tin khách hàng */}
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-bold mb-3 text-lg">Thông tin khách hàng</h4>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">Họ tên:</span>
                  <p className="mt-1">{order.recipientName || 'Không có'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Số điện thoại:</span>
                  <p className="mt-1">{order.phone || 'Không có'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Email:</span>
                  <p className="mt-1">{order.user?.email || 'Không có'}</p>
                </div>
              </div>
            </div>

            {/* Thông tin giao hàng */}
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-bold mb-3 text-lg">Thông tin giao hàng</h4>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">Địa chỉ:</span>
                  <p className="mt-1">{order.address || 'Không có'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Ghi chú:</span>
                  <p className="mt-1 text-gray-500">{order.note || 'Không có ghi chú'}</p>
                </div>
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="lg:col-span-2 bg-white p-4 rounded-lg border">
              <h4 className="font-bold mb-3 text-lg">Danh sách sản phẩm</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">Tên sản phẩm</th>
                      <th className="px-4 py-3 text-left">Đơn vị</th>
                      <th className="px-4 py-3 text-center">Số lượng</th>
                      <th className="px-4 py-3 text-right">Đơn giá</th>
                      <th className="px-4 py-3 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items?.length > 0 ? (
                      order.items.map((item, index) => (
                        <tr key={item.id || `item-${order.id}-${index}`}>
                          <td className="px-4 py-3">{item.productName || 'Không có'}</td>
                          <td className="px-4 py-3">{item.unit || 'Không có'}</td>
                          <td className="px-4 py-3 text-center">{item.quantity || 0}</td>
                          <td className="px-4 py-3 text-right">{formatCurrency(item.price)}</td>
                          <td className="px-4 py-3 text-right font-medium">
                            {formatCurrency((item.price || 0) * (item.quantity || 0))}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                          Không có sản phẩm
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tóm tắt thanh toán & Cập nhật trạng thái */}
            <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tóm tắt thanh toán */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-bold mb-3 text-lg">Tóm tắt thanh toán</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span>{formatCurrency(order.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giảm giá:</span>
                    <span className="text-red-600">-{formatCurrency(order.discount)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <span className="text-green-600">{formatCurrency(order.totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Cập nhật trạng thái */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-bold mb-3 text-lg">Cập nhật trạng thái</h4>
                <div className="space-y-4">
                  <div>
                    <span className="font-medium text-gray-600">Trạng thái hiện tại:</span>
                    <div className="mt-2">
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.status || 'pending')}`}>
                        {getStatusText(order.status || 'pending')}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-600 mb-2">
                      Chọn trạng thái mới:
                    </label>
                    <select
                      value={order.status || 'pending'}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pending">Chờ xác nhận</option>
                      <option value="processing">Đang xử lý</option>
                      <option value="shipping">Đang giao hàng</option>
                      <option value="delivered">Đã giao</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>

                  <div className="text-sm text-gray-500">
                    <p>🕐 Ngày tạo: {formatDate(order.createdAt)}</p>
                    <p>✏️ Cập nhật: {formatDate(order.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Nút đóng */}
            <div className="lg:col-span-2 text-center">
              <button
                onClick={() => toggleOrderDetail(order.id)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Đóng chi tiết
              </button>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b">
        <div className="px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800">Danh sách đơn hàng</h2>
          <p className="text-gray-600 mt-1">Quản lý và cập nhật trạng thái đơn hàng của khách hàng</p>
        </div>
      </div>

      <div className="p-6">
        {/* Thông tin tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="text-blue-600 font-bold text-2xl">{filteredOrders.length}</div>
            <div className="text-blue-800 font-medium">Tổng đơn hàng</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <div className="text-yellow-600 font-bold text-2xl">
              {filteredOrders.filter(o => o.status === 'pending').length}
            </div>
            <div className="text-yellow-800 font-medium">Chờ xác nhận</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="text-purple-600 font-bold text-2xl">
              {filteredOrders.filter(o => o.status === 'shipping').length}
            </div>
            <div className="text-purple-800 font-medium">Đang giao</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="text-green-600 font-bold text-2xl">
              {filteredOrders.filter(o => o.status === 'delivered').length}
            </div>
            <div className="text-green-800 font-medium">Đã giao</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn, tên, SĐT..."
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Mã đơn</th>
                <th className="px-4 py-3 text-left">Khách hàng</th>
                <th className="px-4 py-3 text-left">SĐT</th>
                <th className="px-4 py-3 text-left">Tổng tiền</th>
                <th className="px-4 py-3 text-left">PT thanh toán</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-left">Ngày đặt</th>
                <th className="px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedOrders.map((order, index) => {
                const orderKey = order.id || `order-${index}`;
                return (
                  <React.Fragment key={orderKey}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-medium text-blue-600">{order.id || 'N/A'}</td>
                      <td className="px-4 py-4">{order.recipientName || 'Không có'}</td>
                      <td className="px-4 py-4">{order.phone || 'Không có'}</td>
                      <td className="px-4 py-4 text-green-600 font-medium">{formatCurrency(order.totalPrice)}</td>
                      <td className="px-4 py-4">
                        {order.paymentMethod === 'cod' ? (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">
                            COD
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                            Chuyển khoản
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.status || 'pending')}`}>
                          {getStatusText(order.status || 'pending')}
                        </span>
                      </td>
                      <td className="px-4 py-4">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => toggleOrderDetail(order.id)}
                          className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                            expandedOrderId === order.id
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          }`}
                        >
                          {expandedOrderId === order.id ? 'Đóng' : 'Chi tiết'}
                        </button>
                      </td>
                    </tr>
                    {renderOrderDetail(order)}
                  </React.Fragment>
                );
              })}
              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                    Không tìm thấy đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex flex-col items-center">
          <div className="mb-4 text-sm text-gray-600">
            Hiển thị <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> trên <span className="font-medium">{filteredOrders.length}</span> đơn hàng
          </div>

          {totalPages > 0 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Trang trước"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {totalPages <= 5 ? (
                [...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`flex items-center justify-center w-10 h-10 border rounded-lg transition-colors ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))
              ) : (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className={`flex items-center justify-center w-10 h-10 border rounded-lg transition-colors ${
                      currentPage === 1
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    1
                  </button>
                  {currentPage > 3 && <span className="px-2 text-gray-400">...</span>}
                  {currentPage > 2 && (
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      {currentPage - 1}
                    </button>
                  )}
                  <button
                    onClick={() => setCurrentPage(currentPage)}
                    className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white border-blue-600 rounded-lg"
                  >
                    {currentPage}
                  </button>
                  {currentPage < totalPages - 1 && (
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      {currentPage + 1}
                    </button>
                  )}
                  {currentPage < totalPages - 2 && <span className="px-2 text-gray-400">...</span>}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`flex items-center justify-center w-10 h-10 border rounded-lg transition-colors ${
                      currentPage === totalPages
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Trang sau"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
