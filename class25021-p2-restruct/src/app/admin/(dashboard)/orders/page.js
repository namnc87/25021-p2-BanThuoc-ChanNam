// Admin Orders Page - Server Component
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAllOrders } from '@/actions/orders';
import AdminOrdersTable from './AdminOrdersTable';

async function checkAdminAccess() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        cookie: `access_token=${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) redirect('/admin/login');

    const data = await res.json();
    if (data.user?.role !== 'admin') redirect('/admin/login');

    return data.user;
  } catch (error) {
    redirect('/admin/login');
  }
}

export default async function AdminOrdersPage() {
  await checkAdminAccess();
  const orders = await getAllOrders();

  return <AdminOrdersTable initialOrders={orders} />;
}
