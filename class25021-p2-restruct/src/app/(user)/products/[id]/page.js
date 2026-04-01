// Product Detail Page - Server Component
import { getProductById } from '@/actions/products';
import ProductDetail from './ProductDetail';
import Link from 'next/link';

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProductById(parseInt(id));

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <nav className="text-sm mb-6">
          <Link href="/" className="text-blue-600 hover:underline">Trang chủ</Link> {'>'}
          <Link href="/products" className="text-blue-600 hover:underline ml-2">Sản phẩm</Link>
        </nav>
        <h1 className="text-2xl text-red-600">Lỗi: Không tìm thấy sản phẩm</h1>
        <Link href="/products" className="text-blue-600 hover:underline">← Quay lại danh sách</Link>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
