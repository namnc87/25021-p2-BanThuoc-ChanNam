// ProductFilters - Server Component with form navigation
'use client';

import { useRouter } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';

export default function ProductFilters({
  categories,
  currentFilters
}) {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const params = new URLSearchParams();

    const search = formData.get('search');
    const category = formData.get('category');
    const minPrice = formData.get('minPrice');
    const maxPrice = formData.get('maxPrice');
    const type = formData.get('type');

    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (type) params.set('type', type);

    router.push(`/products?${params.toString()}`);
  };

  const handleClear = () => {
    router.push('/products');
  };

  return (
    <aside className="lg:w-1/4 bg-white p-6 rounded-2xl shadow-md border border-slate-100">
      <h3 className="font-bold text-lg mb-5 text-slate-800 flex items-center gap-2">
        <SlidersHorizontal className="w-5 h-5 text-sky-500" />
        Bộ lọc
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Search */}
        <div>
          <label className="block mb-2 font-medium text-sm text-slate-700">Tìm kiếm</label>
          <input
            type="text"
            name="search"
            defaultValue={currentFilters.search}
            placeholder="Tìm theo tên thuốc..."
            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-slate-50 focus:bg-white text-sm"
          />
        </div>

        {/* Danh mục */}
        <div>
          <label className="block mb-2 font-medium text-sm text-slate-700">Danh mục</label>
          <select
            name="category"
            defaultValue={currentFilters.category}
            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-slate-50 focus:bg-white text-sm appearance-none"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Loại thuốc */}
        <div>
          <label className="block mb-2 font-medium text-sm text-slate-700">Loại thuốc</label>
          <select
            name="type"
            defaultValue={currentFilters.type}
            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-slate-50 focus:bg-white text-sm appearance-none"
          >
            <option value="">Tất cả</option>
            <option value="kedon">Thuốc kê đơn</option>
            <option value="khongkedon">Thuốc không kê đơn</option>
          </select>
        </div>

        {/* Khoảng giá */}
        <div>
          <label className="block mb-2 font-medium text-sm text-slate-700">Khoảng giá</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="minPrice"
              defaultValue={currentFilters.minPrice}
              placeholder="Từ"
              className="w-1/2 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-slate-50 focus:bg-white text-sm"
              min="0"
            />
            <input
              type="number"
              name="maxPrice"
              defaultValue={currentFilters.maxPrice}
              placeholder="Đến"
              className="w-1/2 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-slate-50 focus:bg-white text-sm"
              min="0"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-sky-500 to-sky-600 text-white py-2.5 rounded-xl hover:from-sky-600 hover:to-sky-700 font-medium text-sm shadow-sm shadow-sky-100"
          >
            Áp dụng
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-xl hover:bg-slate-200 font-medium text-sm border border-slate-200"
          >
            Xóa bộ lọc
          </button>
        </div>
      </form>
    </aside>
  );
}
