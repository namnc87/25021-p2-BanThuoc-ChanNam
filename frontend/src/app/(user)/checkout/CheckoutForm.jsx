// CheckoutForm - Client Component for checkout interaction
'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createOrderAction } from '@/actions/orders';

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
          setError('⚠️ ' + result.message);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thông tin thanh toán</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Thông tin giao hàng */}
        <div className="lg:w-1/2">
          <form action={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Thông tin giao hàng</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Họ tên người nhận *</label>
                  <input
                    type="text"
                    name="recipientName"
                    defaultValue={user?.name || ''}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Nhập họ tên người nhận"
                    disabled={isPending}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Số điện thoại *</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={user?.phone || ''}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Nhập số điện thoại"
                    disabled={isPending}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Địa chỉ nhận hàng *</label>
                  <textarea
                    name="address"
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Nhập địa chỉ nhận hàng"
                    disabled={isPending}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Phương thức thanh toán</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    defaultChecked
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                    disabled={isPending}
                  />
                  <div>
                    <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
                    <div className="text-sm text-gray-600">Thanh toán bằng tiền mặt khi nhận hàng</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                    disabled={isPending}
                  />
                  <div>
                    <div className="font-medium">Chuyển khoản ngân hàng</div>
                    <div className="text-sm text-gray-600">Chuyển khoản trước khi nhận hàng</div>
                  </div>
                </label>

                {/* Bank Transfer Information */}
                {paymentMethod === 'bank_transfer' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 ml-7">
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
                        <span className="font-medium text-blue-600">[Your Name] - Thanh toan don hang</span>
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
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded border border-red-200">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Link
                href="/cart"
                className="flex-1 py-2 text-center rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Quay lại giỏ hàng
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className={`flex-1 py-3 rounded font-bold text-white ${
                  isPending ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isPending ? 'Đang xử lý...' : 'Đặt hàng ngay'}
              </button>
            </div>
          </form>
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-200">
                  <Image
                    src={item.productImage || '/images/no-image.png'}
                    alt={item.productName}
                    width={64}
                    height={64}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.productName}</h3>
                    <p className="text-sm text-gray-600">{item.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(item.price * item.quantity)}</p>
                    <p className="text-sm text-gray-600">x{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between">
                <span>Tạm tính ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm)</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>{totals.shippingCost === 0 ? 'Miễn phí' : formatCurrency(totals.shippingCost)}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                <span>Tổng cộng</span>
                <span className="text-green-600">{formatCurrency(totals.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
