// CartContent - Client Component for cart interactions
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { updateCartItemAction, removeCartItemAction } from '@/actions/cart';

export default function CartContent({
  cartItems,
  totals
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState(null);

  const handleUpdateQuantity = async (id, delta) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + delta);
    setLoadingId(id);

    const result = await updateCartItemAction(id, newQty);

    if (result.requiresAuth && !result.success) {
      alert('⚠️ ' + result.message);
      router.push('/login?redirect=/cart');
      return;
    }

    router.refresh();
    setLoadingId(null);
  };

  const handleRemoveItem = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    setLoadingId(id);
    const result = await removeCartItemAction(id);

    if (result.requiresAuth && !result.success) {
      alert('⚠️ ' + result.message);
      router.push('/login?redirect=/cart');
      return;
    }

    router.refresh();
    setLoadingId(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn ({totals.totalItems} sản phẩm)</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Danh sách sản phẩm */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow p-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-200 last:border-0">
                <Image
                  src={item.productImage || '/images/no-image.png'}
                  alt={item.productName}
                  width={64}
                  height={64}
                  className="rounded"
                  style={{ width: 'auto', height: 'auto' }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.productName}</h3>
                  <p className="text-sm text-gray-600">
                    Đơn vị: {item.unit}
                    {item.productCategory && ` • ${item.productCategory}`}
                  </p>
                  <p className="text-green-600 font-bold">
                    {formatCurrency(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, -1)}
                    disabled={loadingId === item.id}
                    className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-10 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, 1)}
                    disabled={loadingId === item.id}
                    className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(item.price * item.quantity)}</p>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={loadingId === item.id}
                    className="text-red-600 hover:text-red-800 mt-1 text-sm disabled:opacity-50"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tạm tính ({totals.totalItems} sản phẩm)</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>
                  {totals.shippingCost === 0 ? 'Miễn phí' : formatCurrency(totals.shippingCost)}
                </span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                <span>Tổng cộng</span>
                <span className="text-green-600">{formatCurrency(totals.totalPrice)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full block mt-6 bg-green-600 text-white text-center py-3 rounded font-bold hover:bg-green-700"
            >
              Tiến hành thanh toán
            </Link>

            <Link
              href="/products"
              className="w-full block mt-3 bg-gray-200 text-gray-800 text-center py-2 rounded hover:bg-gray-300"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
