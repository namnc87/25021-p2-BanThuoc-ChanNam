// Checkout Page - Server Component
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCartItems } from '@/actions/cart';
import CheckoutForm from './CheckoutForm';

export const dynamic = 'force-dynamic';

async function getUserData() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return null;
  }

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const authPath = API_URL.endsWith('/api') ? '/auth/me' : '/api/auth/me';
    const res = await fetch(`${API_URL}${authPath}`, {
      headers: {
        cookie: `access_token=${token}`,
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      return data.user;
    }
  } catch (error) {
    console.error('Failed to fetch user:', error);
  }

  return null;
}

export default async function CheckoutPage() {
  const [cartItems, user] = await Promise.all([
    getCartItems(),
    getUserData(),
  ]);

  // Check if user is logged in
  if (!user) {
    redirect('/login?redirect=/checkout');
  }

  // Check if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl text-red-600">Giỏ hàng trống</h1>
        <a href="/products" className="text-blue-600 hover:underline">
          Tiếp tục mua sắm
        </a>
      </div>
    );
  }

  // Calculate totals on server
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal >= 500000 ? 0 : 25000;
  const totalPrice = subtotal + shippingCost;

  return (
    <CheckoutForm
      cartItems={cartItems}
      user={user}
      totals={{ subtotal, shippingCost, totalPrice }}
    />
  );
}
