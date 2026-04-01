// ProductFilters - Server Component with form navigation
'use client';

import { useRouter } from 'next/navigation';

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
    <aside className="lg:w-1/4 bg-gray-50 p-4 rounded-lg shadow-sm">
      <h3 className="font-bold text-lg mb-4">Bộ lọc</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Search */}
        <div>
          <label className="block mb-2 font-medium">Tìm kiếm</label>
          <input
            type="text"
            name="search"
            defaultValue={currentFilters.search}
            placeholder="Tìm theo tên thuốc..."
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Danh mục */}
        <div>
          <label className="block mb-2 font-medium">Danh mục</label>
          <select
            name="category"
            defaultValue={currentFilters.category}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Loại thuốc */}
        <div>
          <label className="block mb-2 font-medium">Loại thuốc</label>
          <select
            name="type"
            defaultValue={currentFilters.type}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            <option value="kedon">Thuốc kê đơn</option>
            <option value="khongkedon">Thuốc không kê đơn</option>
          </select>
        </div>

        {/* Khoảng giá */}
        <div>
          <label className="block mb-2 font-medium">Khoảng giá</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="minPrice"
              defaultValue={currentFilters.minPrice}
              placeholder="Từ"
              className="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
            <input
              type="number"
              name="maxPrice"
              defaultValue={currentFilters.maxPrice}
              placeholder="Đến"
              className="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Áp dụng
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      </form>
    </aside>
  );
}
