// AddToCartButton - Client Component for adding to cart
'use client';

import { useState } from 'react';
import { addToCartAction } from '@/actions/cart';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

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
        className={`w-full py-3 rounded font-bold text-white ${
          isAdding ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
      </button>

      {message && (
        <div className={`mt-3 p-2 rounded text-center flex items-center justify-center gap-2 ${
          message.startsWith('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
