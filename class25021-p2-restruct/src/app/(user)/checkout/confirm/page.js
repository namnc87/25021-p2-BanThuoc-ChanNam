// Order Confirmation Page - Server Component
import { getOrderById } from '@/actions/orders';
import OrderConfirmationView from './OrderConfirmationView';

export default async function OrderConfirmationPage({ searchParams }) {
  const sp = await searchParams;
  const orderId = sp.id;

  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl text-red-600">Lỗi: Thiếu mã đơn hàng</h1>
        <a href="/products" className="text-blue-600 hover:underline">← Quay lại trang chủ</a>
      </div>
    );
  }

  const order = await getOrderById(orderId);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl text-red-600">Lỗi: Không tìm thấy đơn hàng</h1>
        <a href="/products" className="text-blue-600 hover:underline">← Quay lại trang chủ</a>
      </div>
    );
  }

  return <OrderConfirmationView order={order} />;
}
