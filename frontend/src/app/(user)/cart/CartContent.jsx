// CartContent - Client Component for cart interactions
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { updateCartItemAction, removeCartItemAction } from '@/actions/cart';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

export default function CartContent({
  cartItems,
  totals
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleUpdateQuantity = async (id, delta) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + delta);
    setLoadingId(id);

    const result = await updateCartItemAction(id, newQty);

    if (result.requiresAuth && !result.success) {
      setMessage({ type: 'error', text: result.message });
      setTimeout(() => {
        router.push('/login?redirect=/cart');
      }, 1500);
      return;
    }

    router.refresh();
    setLoadingId(null);
  };

  const handleRemoveItem = async (id) => {
    setLoadingId(id);
    const result = await removeCartItemAction(id);

    if (result.requiresAuth && !result.success) {
      setMessage({ type: 'error', text: result.message });
      setTimeout(() => {
        router.push('/login?redirect=/cart');
      }, 1500);
      return;
    }

    router.refresh();
    setLoadingId(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {message && (
        <div className={`p-3.5 rounded-xl mb-5 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {message.text}
        </div>
      )}

      <h1 className="text-2xl font-extrabold mb-2 text-slate-800 flex items-center gap-3">
        <ShoppingCart className="w-7 h-7 text-sky-500" />
        Giỏ hàng của bạn
      </h1>
      <p className="text-slate-500 mb-7">{totals.totalItems} sản phẩm trong giỏ hàng</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Danh sách sản phẩm */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-5 border-b border-slate-100 last:border-0">
                <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                  <Image
                    src={item.productImage || '/images/no-image.png'}
                    alt={item.productName}
                    width={64}
                    height={64}
                    className="rounded-xl"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800">{item.productName}</h3>
                  <p className="text-sm text-slate-500">
                    Đơn vị: {item.unit}
                    {item.productCategory && ` • ${item.productCategory}`}
                  </p>
                  <p className="text-emerald-600 font-bold mt-1">
                    {formatCurrency(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, -1)}
                    disabled={loadingId === item.id}
                    className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-sky-50 hover:border-sky-200 hover:text-sky-600 disabled:opacity-50 bg-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-medium text-slate-800">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, 1)}
                    disabled={loadingId === item.id}
                    className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-sky-50 hover:border-sky-200 hover:text-sky-600 disabled:opacity-50 bg-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">{formatCurrency(item.price * item.quantity)}</p>
                  <button
                    onClick={() => setConfirmDelete(item.id)}
                    disabled={loadingId === item.id}
                    className="text-red-400 hover:text-red-600 mt-1 text-sm disabled:opacity-50 font-medium"
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
          <div className="bg-white rounded-2xl shadow-md p-7 sticky top-20 border border-slate-100">
            <h2 className="text-xl font-bold mb-5 text-slate-800">Tóm tắt đơn hàng</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Tạm tính ({totals.totalItems} sản phẩm)</span>
                <span className="font-medium text-slate-800">{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-slate-800">
                  {totals.shippingCost === 0 ? <span className="text-emerald-600">Miễn phí</span> : formatCurrency(totals.shippingCost)}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between font-bold text-lg">
                <span className="text-slate-800">Tổng cộng</span>
                <span className="text-emerald-600">{formatCurrency(totals.totalPrice)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full block mt-7 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center py-3.5 rounded-xl font-bold hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-100 text-sm"
            >
              Tiến hành thanh toán →
            </Link>

            <Link
              href="/products"
              className="w-full block mt-3 bg-slate-100 text-slate-600 text-center py-2.5 rounded-xl hover:bg-slate-200 text-sm font-medium border border-slate-200"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
        onConfirm={() => {
          if (confirmDelete) handleRemoveItem(confirmDelete);
          setConfirmDelete(null);
        }}
        onCancel={() => setConfirmDelete(null)}
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
}
