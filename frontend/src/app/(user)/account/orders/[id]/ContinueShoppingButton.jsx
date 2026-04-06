'use client';

import { useRouter } from 'next/navigation';

export default function ContinueShoppingButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        router.refresh();
        router.push('/products');
      }}
      className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
    >
      Tiếp tục mua sắm
    </button>
  );
}
