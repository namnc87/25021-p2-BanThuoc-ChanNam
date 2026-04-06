// Orders Page - Server Component
import { checkAuth } from '@/actions/auth';
import { redirect } from 'next/navigation';
import { getUserOrders } from '@/actions/orders';
import OrdersList from './OrdersList';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const user = await checkAuth();

  if (!user) {
    redirect('/login?redirect=/account/orders');
  }

  const orders = await getUserOrders();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Đơn hàng của tôi</h2>
      <OrdersList orders={orders} />
    </div>
  );
}
