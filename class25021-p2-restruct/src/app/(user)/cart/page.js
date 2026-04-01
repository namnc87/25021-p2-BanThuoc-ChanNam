// Cart Page - Server Component
import { getCartItems } from '@/actions/cart';
import { redirect } from 'next/navigation';
import CartContent from './CartContent';

export default async function CartPage() {
  const cartItems = await getCartItems();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn</h1>
        <p className="text-gray-600">Giỏ hàng hiện đang trống.</p>
        <a
          href="/products"
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tiếp tục mua sắm
        </a>
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
