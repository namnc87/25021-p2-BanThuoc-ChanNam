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
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-2 text-slate-800">Danh sách sản phẩm</h1>
      <p className="text-slate-500 mb-8">Tìm kiếm và chọn sản phẩm phù hợp với nhu cầu của bạn</p>

      <div className="flex flex-col lg:flex-row gap-7">
        {/* Sidebar Filters - Server Component with form navigation */}
        <ProductFilters categories={categories} currentFilters={currentFilters} />

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Header với số lượng và sắp xếp */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div>
              <p className="text-slate-600 text-sm">
                Tìm thấy <span className="font-bold text-sky-600">{products.length}</span> sản phẩm
                {currentFilters.search && (
                  <span> cho &quot;<span className="font-semibold text-slate-800">{currentFilters.search}</span>&quot;</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm">Sắp xếp:</span>
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
                className="p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-slate-50 text-sm appearance-none"
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
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <p className="text-slate-400 text-lg mb-4">Không tìm thấy sản phẩm nào.</p>
              <Link
                href="/products"
                className="inline-block bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 py-2.5 rounded-xl hover:from-sky-600 hover:to-sky-700 font-medium text-sm"
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
                    <div key={product.id} className="bg-white border border-slate-100 rounded-2xl p-5 card-hover shadow-sm">
                      <div className="w-full h-48 flex items-center justify-center mb-4 bg-slate-50 rounded-xl overflow-hidden">
                        <Image
                          src={product.image || '/images/no-image.png'}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="max-w-full max-h-full object-contain"
                          style={{ width: 'auto', height: 'auto' }}
                        />
                      </div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1 text-slate-800">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-sky-50 text-sky-700 text-xs rounded-full font-medium border border-sky-100">
                          {product.category}
                        </span>
                        {product.type === 'kedon' && (
                          <span className="px-3 py-1 bg-red-50 text-red-700 text-xs rounded-full font-medium border border-red-100">
                            Kê đơn
                          </span>
                        )}
                      </div>
                      <p className="text-emerald-600 font-bold text-lg mb-4">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(minPrice)}
                        {product.units?.length > 1 && (
                          <span className="text-slate-400 text-sm ml-1 font-normal">(từ)</span>
                        )}
                      </p>
                      <Link
                        href={`/products/${product.id}`}
                        className="block w-full text-center bg-gradient-to-r from-sky-500 to-sky-600 text-white py-2.5 rounded-xl hover:from-sky-600 hover:to-sky-700 font-medium text-sm shadow-sm shadow-sky-100"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-10">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm ${currentPage === 1 ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'hover:bg-sky-50 hover:border-sky-200 hover:text-sky-600 bg-white'}`}
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
                            className={`px-4 py-2.5 border rounded-xl text-sm font-medium ${currentPage === pageNum
                              ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white border-sky-500 shadow-md shadow-sky-100'
                              : 'border-slate-200 hover:bg-sky-50 hover:border-sky-200 hover:text-sky-600 bg-white'}`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return <span key={pageNum} className="px-2 text-slate-400">...</span>;
                      }
                      return null;
                    })}

                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'hover:bg-sky-50 hover:border-sky-200 hover:text-sky-600 bg-white'}`}
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
