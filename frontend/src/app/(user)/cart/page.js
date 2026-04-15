// Cart Page - Server Component
import { getCartItems } from '@/actions/cart';
import { redirect } from 'next/navigation';
import CartContent from './CartContent';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const cartItems = await getCartItems();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-slate-400" />
          </div>
          <h1 className="text-2xl font-extrabold mb-3 text-slate-800">Giỏ hàng của bạn</h1>
          <p className="text-slate-500 mb-6">Giỏ hàng hiện đang trống.</p>
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 py-3 rounded-xl hover:from-sky-600 hover:to-sky-700 font-medium shadow-md shadow-sky-100"
          >
            Tiếp tục mua sắm →
          </Link>
        </div>
      </div>
    );
  }

  // Calculate totals on server
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal >= 500000 ? 0 : 25000;
  const totalPrice = subtotal + shippingCost;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContent
      cartItems={cartItems}
      totals={{ subtotal, shippingCost, totalPrice, totalItems }}
    />
  );
}
