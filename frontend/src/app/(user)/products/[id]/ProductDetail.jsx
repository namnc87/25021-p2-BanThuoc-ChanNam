// ProductDetail - Client Component
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import AddToCartButton from './AddToCartButton';
import { Minus, Plus } from 'lucide-react';

export default function ProductDetail({ product }) {
  const [imageError, setImageError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('category');
  const [quantity, setQuantity] = useState(1);

  // Get main image and additional images separately
  const mainImage = imageError ? '/images/no-image.png' : (product.image || '/images/no-image.png');
  const additionalImages = product.images?.filter(Boolean) || [];
  
  // Display image is selected additional image or main image
  const displayImage = additionalImages.length > 0 && selectedImage < additionalImages.length
    ? additionalImages[selectedImage]
    : mainImage;
    
  const selectedUnit = product.units?.[selectedUnitIndex];
  const currentPrice = selectedUnit?.price || 0;
  const totalPrice = currentPrice * quantity;

  const tabs = [
    { id: 'category', label: 'Danh mục' },
    { id: 'manufacturer', label: 'Nhà sản xuất' },
    { id: 'ingredients', label: 'Thành phần' },
    { id: 'usage', label: 'Công dụng' },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <nav className="text-sm mb-8 flex items-center gap-2 text-slate-500">
        <Link href="/" className="text-sky-600 hover:text-sky-700 font-medium">Trang chủ</Link>
        <span className="text-slate-300">›</span>
        <Link href="/products" className="text-sky-600 hover:text-sky-700 font-medium">Sản phẩm</Link>
        <span className="text-slate-300">›</span>
        <span className="text-slate-700 font-medium">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Hình ảnh */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
            {/* Main Image - Use object-contain to show full product */}
            <div className="w-full h-72 sm:h-80 md:h-96 flex items-center justify-center mb-5 relative bg-slate-50 rounded-2xl overflow-hidden">
              <Image
                src={displayImage}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                onError={() => setImageError(true)}
              />
            </div>

            {/* Image Thumbnails - Only show if there are additional images */}
            {additionalImages.length > 0 && (
              <div className="flex gap-3 overflow-x-auto">
                {additionalImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 border-2 rounded-xl overflow-hidden ${
                      selectedImage === idx ? 'border-sky-500 shadow-md shadow-sky-100' : 'border-slate-200 hover:border-sky-400'
                    }`}
                  >
                  <Image
                    src={img}
                    alt={`${product.name} - ${idx + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Thông tin */}
        <div className="lg:w-1/2">
          {/* Tab Navigation */}
          <div className="mb-7">
            <div className="flex flex-wrap md:flex-nowrap mb-5 gap-2 bg-slate-100 p-1 rounded-2xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`px-3 sm:px-4 py-2.5 font-medium text-sm rounded-xl flex-1 whitespace-nowrap min-w-[calc(50%-4px)] md:min-w-0 ${
                    activeTab === tab.id
                      ? 'bg-white text-sky-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  data-tab={tab.id}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="min-h-[100px] bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div id="tab-category" className={activeTab === 'category' ? 'text-slate-700' : 'hidden'}>
                <p><span className="font-medium text-slate-800">Danh mục:</span> {product.category || 'Không xác định'}</p>
                {product.type && (
                  <p className="mt-3">
                    <span className="font-medium text-slate-800">Loại:</span>{' '}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.type === 'kedon'
                        ? 'bg-red-50 text-red-700 border border-red-100'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                      {product.type === 'kedon' ? 'Thuốc kê đơn' : 'Thuốc không kê đơn'}
                    </span>
                  </p>
                )}
              </div>
              <div id="tab-manufacturer" className={activeTab === 'manufacturer' ? 'text-slate-700' : 'hidden'}>
                <p><span className="font-medium text-slate-800">Nhà sản xuất:</span> {product.manufacturer || 'Thông tin chưa được cung cấp.'}</p>
              </div>
              <div id="tab-ingredients" className={activeTab === 'ingredients' ? 'text-slate-700' : 'hidden'}>
                <p><span className="font-medium text-slate-800">Thành phần:</span> {product.ingredients || 'Thông tin thành phần chưa được cung cấp.'}</p>
              </div>
              <div id="tab-usage" className={activeTab === 'usage' ? 'text-slate-700' : 'hidden'}>
                <p><span className="font-medium text-slate-800">Công dụng:</span> {product.usage || 'Thông tin công dụng chưa được cung cấp.'}</p>
                {product.description && (
                  <p className="mt-3"><span className="font-medium text-slate-800">Mô tả:</span> {product.description}</p>
                )}
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold mb-4 text-slate-800">{product.name}</h1>

          <div className="mb-5 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-100">
            <span className="text-emerald-600 font-extrabold text-3xl">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
            </span>
          </div>

          {/* Chọn đơn vị và Số lượng */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-7 gap-4 sm:gap-6">
            {/* Chọn đơn vị */}
            <div className="w-full sm:flex-1">
              <label className="block mb-2 font-medium text-sm text-slate-700">Chọn đơn vị:</label>
              <select
                value={selectedUnitIndex}
                onChange={(e) => {
                  setSelectedUnitIndex(parseInt(e.target.value));
                  setQuantity(1); // Reset quantity when changing unit
                }}
                className="border border-slate-200 rounded-xl px-4 py-3 w-full bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-sm appearance-none"
              >
                {product.units?.map((unit, idx) => (
                  <option key={idx} value={idx}>
                    {unit.name} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(unit.price)}
                  </option>
                ))}
              </select>
            </div>

            {/* Số lượng */}
            <div>
              <label className="block mb-2 font-medium text-sm text-slate-700">Số lượng:</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-sky-50 hover:border-sky-200 hover:text-sky-600 bg-white"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-20 text-center border border-slate-200 rounded-xl py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-sky-50 hover:border-sky-200 hover:text-sky-600 bg-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Nút thêm vào giỏ */}
          <AddToCartButton product={product} selectedUnitIndex={selectedUnitIndex} quantity={quantity} />
        </div>
      </div>
    </div>
  );
}
