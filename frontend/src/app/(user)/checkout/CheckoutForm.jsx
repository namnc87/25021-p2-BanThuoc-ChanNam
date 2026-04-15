// CheckoutForm - Client Component for checkout interaction
'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createOrderAction } from '@/actions/orders';
import { CreditCard, Truck, Wallet, Landmark, AlertTriangle, ClipboardList } from 'lucide-react';

export default function CheckoutForm({
  cartItems,
  user,
  totals,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const handleSubmit = async (formData) => {
    setError('');

    // Validate
    const recipientName = formData.get('recipientName');
    const phone = formData.get('phone');
    const address = formData.get('address');

    if (!recipientName?.trim()) {
      setError('Vui lòng nhập họ tên người nhận.');
      return;
    }
    if (!phone?.trim()) {
      setError('Vui lòng nhập số điện thoại.');
      return;
    }
    if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(phone)) {
      setError('Số điện thoại không hợp lệ.');
      return;
    }
    if (!address?.trim()) {
      setError('Vui lòng nhập địa chỉ nhận hàng.');
      return;
    }

    // Add cart items to form data
    formData.set('items', JSON.stringify(cartItems.map(item => ({
      productId: item.productId,
      productName: item.productName,
      unit: item.unit,
      quantity: item.quantity,
      price: item.price,
      image: item.productImage,
    }))));
    formData.set('subtotal', totals.subtotal.toString());
    formData.set('shippingCost', totals.shippingCost.toString());
    formData.set('totalPrice', totals.totalPrice.toString());

    startTransition(async () => {
      const result = await createOrderAction(formData);
      if (result?.success === false) {
        if (result.requiresAuth) {
          setError(result.message);
          // Redirect to login after 1.5 seconds
          setTimeout(() => {
            router.push('/login?redirect=/checkout');
          }, 1500);
        } else {
          setError(result.message || 'Không thể đặt hàng');
        }
      }
      // If success, the server action will redirect
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold mb-2 text-slate-800 flex items-center gap-3">
        <CreditCard className="w-7 h-7 text-sky-500" />
        Thông tin thanh toán
      </h1>
      <p className="text-slate-500 mb-8">Vui lòng kiểm tra thông tin trước khi đặt hàng</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Thông tin giao hàng */}
        <div className="lg:w-1/2">
          <form action={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-100">
              <h2 className="text-xl font-bold mb-5 text-slate-800 flex items-center gap-2">
                <Truck className="w-5 h-5 text-sky-500" />
                Thông tin giao hàng
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block mb-1.5 font-medium text-sm text-slate-700">Họ tên người nhận *</label>
                  <input
                    type="text"
                    name="recipientName"
                    defaultValue={user?.name || ''}
                    className="w-full p-3.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-sm"
                    placeholder="Nhập họ tên người nhận"
                    disabled={isPending}
                  />
                </div>
                <div>
                  <label className="block mb-1.5 font-medium text-sm text-slate-700">Số điện thoại *</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={user?.phone || ''}
                    className="w-full p-3.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-sm"
                    placeholder="Nhập số điện thoại"
                    disabled={isPending}
                  />
                </div>
                <div>
                  <label className="block mb-1.5 font-medium text-sm text-slate-700">Địa chỉ nhận hàng *</label>
                  <textarea
                    name="address"
                    rows="3"
                    className="w-full p-3.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-sm"
                    placeholder="Nhập địa chỉ nhận hàng"
                    disabled={isPending}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-100">
              <h2 className="text-xl font-bold mb-5 text-slate-800 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-sky-500" />
                Phương thức thanh toán
              </h2>
              <div className="space-y-4">
                <label className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer ${paymentMethod === 'cod' ? 'border-sky-400 bg-sky-50' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    defaultChecked
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 accent-sky-500"
                    disabled={isPending}
                  />
                  <div>
                    <div className="font-medium text-slate-800 text-sm">Thanh toán khi nhận hàng (COD)</div>
                    <div className="text-xs text-slate-500 mt-0.5">Thanh toán bằng tiền mặt khi nhận hàng</div>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer ${paymentMethod === 'bank_transfer' ? 'border-sky-400 bg-sky-50' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 accent-sky-500"
                    disabled={isPending}
                  />
                  <div>
                    <div className="font-medium text-slate-800 text-sm">Chuyển khoản ngân hàng</div>
                    <div className="text-xs text-slate-500 mt-0.5">Chuyển khoản trước khi nhận hàng</div>
                  </div>
                </label>

                {/* Bank Transfer Information */}
                {paymentMethod === 'bank_transfer' && (
                  <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 ml-7">
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
                        <span className="font-medium text-sky-600">[Your Name] - Thanh toan don hang</span>
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
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-3.5 rounded-xl border border-red-100 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Link
                href="/cart"
                className="flex-1 py-3 text-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm"
              >
                ← Quay lại giỏ hàng
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className={`flex-1 py-3.5 rounded-xl font-bold text-white text-sm ${
                  isPending ? 'bg-slate-300' : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-100'
                }`}
              >
                {isPending ? 'Đang xử lý...' : 'Đặt hàng ngay →'}
              </button>
            </div>
          </form>
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-2xl shadow-md p-7 sticky top-20 border border-slate-100">
            <h2 className="text-xl font-bold mb-5 text-slate-800 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-sky-500" />
              Tóm tắt đơn hàng
            </h2>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3 border-b border-slate-100">
                  <div className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
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
                    <h3 className="font-medium text-sm text-slate-800">{item.productName}</h3>
                    <p className="text-xs text-slate-500">{item.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-slate-800">{formatCurrency(item.price * item.quantity)}</p>
                    <p className="text-xs text-slate-500">x{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Tạm tính ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm)</span>
                <span className="font-medium text-slate-800">{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-slate-800">{totals.shippingCost === 0 ? <span className="text-emerald-600">Miễn phí</span> : formatCurrency(totals.shippingCost)}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between font-bold text-lg">
                <span className="text-slate-800">Tổng cộng</span>
                <span className="text-emerald-600">{formatCurrency(totals.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
