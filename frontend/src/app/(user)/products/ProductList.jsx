// ProductList - Client Component
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductFilters from './ProductFilters';

export default function ProductList({
  products,
  categories,
  currentFilters
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Pagination on server
  const itemsPerPage = 6;
  const currentPage = parseInt(searchParams.get('page') || '1');
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Danh sách sản phẩm</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters - Server Component with form navigation */}
        <ProductFilters categories={categories} currentFilters={currentFilters} />

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Header với số lượng và sắp xếp */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <p className="text-gray-600">
                Tìm thấy <span className="font-bold text-blue-600">{products.length}</span> sản phẩm
                {currentFilters.search && (
                  <span> cho &quot;<span className="font-semibold">{currentFilters.search}</span>&quot;</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Sắp xếp:</span>
              <select
                value={currentFilters.sort}
                onChange={(e) => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (e.target.value === 'default') {
                    params.delete('sort');
                  } else {
                    params.set('sort', e.target.value);
                  }
                  params.set('page', '1');
                  router.push(`/products?${params.toString()}`);
                }}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">Mặc định</option>
                <option value="name-asc">Tên A-Z</option>
                <option value="name-desc">Tên Z-A</option>
                <option value="price-asc">Giá thấp → cao</option>
                <option value="price-desc">Giá cao → thấp</option>
              </select>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          {paginatedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào.</p>
              <Link
                href="/products"
                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Xóa bộ lọc
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map(product => {
                  const minPrice = Math.min(...(product.units?.map(u => u.price) || [0]));

                  return (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="w-full h-48 flex items-center justify-center mb-3">
                        <Image
                          src={product.image || '/images/no-image.png'}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {product.category}
                        </span>
                        {product.type === 'kedon' && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                            Kê đơn
                          </span>
                        )}
                      </div>
                      <p className="text-green-600 font-bold text-lg mb-3">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(minPrice)}
                        {product.units?.length > 1 && (
                          <span className="text-gray-500 text-sm ml-1">(từ)</span>
                        )}
                      </p>
                      <Link
                        href={`/products/${product.id}`}
                        className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                      ←
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      const showPage =
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

                      if (showPage) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 border rounded ${currentPage === pageNum
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'hover:bg-gray-50'}`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return <span key={pageNum} className="px-2">...</span>;
                      }
                      return null;
                    })}

                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 border rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                      →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
