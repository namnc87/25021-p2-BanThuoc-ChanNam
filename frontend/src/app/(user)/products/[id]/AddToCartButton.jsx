// AddToCartButton - Client Component for adding to cart
'use client';

import { useState } from 'react';
import { addToCartAction } from '@/actions/cart';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertTriangle, XCircle, ShoppingCart } from 'lucide-react';

export default function AddToCartButton({ product, selectedUnitIndex = 0, quantity = 1 }) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddToCart = async () => {
    setIsAdding(true);
    setMessage('');

    const selectedUnitIndexValue = selectedUnitIndex;
    const selectedUnit = product.units?.[selectedUnitIndexValue] || {};

    const result = await addToCartAction(
      product.id,
      selectedUnit.name,
      quantity,
      selectedUnit.price
    );

    if (result.success) {
      setMessage('success');
      // Refresh page after 1 second to update cart count in header
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } else {
      if (result.requiresAuth) {
        // Show message and redirect to login
        setMessage(`warning: ${result.message}`);
        setTimeout(() => {
          router.push('/login?redirect=/products/' + product.id);
        }, 1500);
      } else {
        setMessage(`error: ${result.message}`);
      }
    }

    setIsAdding(false);
  };

  return (
    <>
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`w-full py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 text-lg ${
          isAdding
            ? 'bg-slate-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-100 hover:shadow-xl hover:shadow-emerald-200 hover:-translate-y-0.5'
        }`}
      >
        <ShoppingCart className="w-5 h-5" />
        {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
      </button>

      {message && (
        <div className={`mt-4 p-3 rounded-xl text-center flex items-center justify-center gap-2 text-sm font-medium ${
          message.startsWith('success') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.startsWith('success') && <CheckCircle className="w-4 h-4" />}
          {message.startsWith('warning') && <AlertTriangle className="w-4 h-4" />}
          {message.startsWith('error') && <XCircle className="w-4 h-4" />}
          {message.replace(/^(success|warning|error): /, '').replace('success', 'Đã thêm vào giỏ hàng!')}
        </div>
      )}
    </>
  );
}
