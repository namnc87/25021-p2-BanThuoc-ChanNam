// Home Page - Server Component
import { getProducts, getCategories } from '@/actions/products';
import Link from 'next/link';
import Image from 'next/image';
import { Pill, Bandage, Bot, Baby, Dumbbell, Leaf, MapPin, Phone, Mail } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 text-white py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl font-extrabold mb-5 leading-tight tracking-tight">Nhà thuốc trực tuyến uy tín</h1>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">Cung cấp thuốc chất lượng cao, giao hàng nhanh chóng, tư vấn chuyên nghiệp 24/7</p>
          <Link href="/products" className="bg-white text-emerald-600 px-8 py-3.5 rounded-full font-bold hover:bg-emerald-50 inline-block shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-900/30 hover:-translate-y-0.5">
            Khám phá ngay →
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-3 text-slate-800">Sản phẩm nổi bật</h2>
          <p className="text-slate-500 text-center mb-10">Những sản phẩm được tin dùng nhiều nhất</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {featuredProducts.map((product) => {
              const price = product.units?.[0]?.price || 0;
              return (
                <div key={product.id} className="bg-white rounded-2xl shadow-md p-5 card-hover border border-slate-100">
                  <div className="w-full h-48 flex items-center justify-center mb-4 bg-slate-50 rounded-xl overflow-hidden">
                    <Image
                      src={product.image || '/images/no-image.png'}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="max-w-full max-h-full object-contain"
                      style={{ width: 'auto', height: 'auto' }}
                      loading="eager"
                    />
                  </div>
                  <h3 className="font-semibold text-slate-800 line-clamp-1">{product.name}</h3>
                  <p className="text-emerald-600 font-bold mt-2 text-lg">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                  </p>
                  <Link
                    href={`/products/${product.id}`}
                    className="mt-4 inline-block w-full text-center bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-sky-600 hover:to-sky-700 shadow-sm shadow-sky-100"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-3 text-slate-800">Danh mục sản phẩm</h2>
          <p className="text-slate-500 text-center mb-10">Khám phá các danh mục thuốc đa dạng</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
            {categories.map((category, index) => {
              // Different icons for different categories
              const iconMap = [Pill, Bandage, Bot, Baby, Dumbbell, Leaf];
              const IconComponent = iconMap[index % iconMap.length];
              const gradients = [
                'from-sky-400 to-blue-500',
                'from-emerald-400 to-teal-500',
                'from-violet-400 to-purple-500',
                'from-amber-400 to-orange-500',
                'from-rose-400 to-pink-500',
                'from-lime-400 to-green-500',
              ];

              return (
                <div key={category.id} className="bg-white rounded-2xl shadow-md p-7 text-center card-hover border border-slate-100">
                  <div className={`w-16 h-16 bg-gradient-to-br ${gradients[index % gradients.length]} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800">{category.name}</h3>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">{category.description}</p>
                  <Link
                    href={`/products?category=${encodeURIComponent(category.name)}`}
                    className="mt-5 inline-block text-sky-600 hover:text-sky-700 font-medium text-sm group"
                  >
                    Xem tất cả <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-3 text-slate-800">Liên hệ</h2>
          <p className="text-slate-500 text-center mb-10">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
          <div className="max-w-2xl mx-auto text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-8">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white">
                <div className="flex justify-center mb-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-md">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                </div>
                <h3 className="font-bold mb-2 text-slate-800">Địa chỉ</h3>
                <p className="text-slate-500 text-sm">123 Đường ABC, Quận 1, TP.HCM</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white">
                <div className="flex justify-center mb-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-md">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                </div>
                <h3 className="font-bold mb-2 text-slate-800">Hotline</h3>
                <p className="text-slate-500 text-sm">1900 1234</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white">
                <div className="flex justify-center mb-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-md">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                </div>
                <h3 className="font-bold mb-2 text-slate-800">Email</h3>
                <p className="text-slate-500 text-sm">info@pharmahub.vn</p>
              </div>
            </div>
            <p className="text-slate-500 bg-white/60 backdrop-blur-sm py-3 px-6 rounded-full inline-block">
              <strong className="text-slate-700">Giờ làm việc:</strong> 5:00 ~ 22:00 mỗi ngày
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
