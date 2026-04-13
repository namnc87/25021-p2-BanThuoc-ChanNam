// ProductDetail - Client Component
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import AddToCartButton from './AddToCartButton';

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

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm mb-6">
        <Link href="/" className="text-blue-600 hover:underline">Trang chủ</Link> {'>'}
        <Link href="/products" className="text-blue-600 hover:underline ml-2">Sản phẩm</Link> {'>'}
        <span className="ml-2 text-gray-700">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Hình ảnh */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-lg shadow p-4">
            {/* Main Image - Use object-contain to show full product */}
            <div className="w-full h-96 flex items-center justify-center mb-4 relative">
              <Image
                src={displayImage}
                alt={product.name}
                fill
                className="object-contain"
                onError={() => setImageError(true)}
              />
            </div>

            {/* Image Thumbnails - Only show if there are additional images */}
            {additionalImages.length > 0 && (
              <div className="flex gap-2 overflow-x-auto">
                {additionalImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${
                      selectedImage === idx ? 'border-blue-500' : 'border-gray-300 hover:border-blue-500'
                    }`}
                  >
                  <Image
                    src={img}
                    alt={`${product.name} - ${idx + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
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
          <div className="mb-6">
            <div className="flex border-b mb-4 gap-2">
              <button
                className={`px-4 py-2 font-medium text-sm border-b-2 ${
                  activeTab === 'category' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab('category')}
                data-tab="category"
              >
                Danh mục
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm border-b-2 ${
                  activeTab === 'manufacturer' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab('manufacturer')}
                data-tab="manufacturer"
              >
                Nhà sản xuất
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm border-b-2 ${
                  activeTab === 'ingredients' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab('ingredients')}
                data-tab="ingredients"
              >
                Thành phần
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm border-b-2 ${
                  activeTab === 'usage' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab('usage')}
                data-tab="usage"
              >
                Công dụng
              </button>
            </div>

            <div className="min-h-[100px]">
              <div id="tab-category" className={activeTab === 'category' ? 'text-gray-700' : 'hidden'}>
                <p><span className="font-medium">Danh mục:</span> {product.category || 'Không xác định'}</p>
                {product.type && (
                  <p className="mt-2">
                    <span className="font-medium">Loại:</span>{' '}
                    <span className={`px-2 py-1 rounded text-sm ${
                      product.type === 'kedon'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {product.type === 'kedon' ? 'Thuốc kê đơn' : 'Thuốc không kê đơn'}
                    </span>
                  </p>
                )}
              </div>
              <div id="tab-manufacturer" className={activeTab === 'manufacturer' ? 'text-gray-700' : 'hidden'}>
                <p><span className="font-medium">Nhà sản xuất:</span> {product.manufacturer || 'Thông tin chưa được cung cấp.'}</p>
              </div>
              <div id="tab-ingredients" className={activeTab === 'ingredients' ? 'text-gray-700' : 'hidden'}>
                <p><span className="font-medium">Thành phần:</span> {product.ingredients || 'Thông tin thành phần chưa được cung cấp.'}</p>
              </div>
              <div id="tab-usage" className={activeTab === 'usage' ? 'text-gray-700' : 'hidden'}>
                <p><span className="font-medium">Công dụng:</span> {product.usage || 'Thông tin công dụng chưa được cung cấp.'}</p>
                {product.description && (
                  <p className="mt-2"><span className="font-medium">Mô tả:</span> {product.description}</p>
                )}
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <div className="mb-4">
            <span className="text-green-600 font-bold text-2xl">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
            </span>
          </div>

          {/* Chọn đơn vị và Số lượng */}
          <div className="flex justify-between items-start mb-6">
            {/* Chọn đơn vị */}
            <div>
              <label className="block mb-2 font-medium">Chọn đơn vị:</label>
              <select
                value={selectedUnitIndex}
                onChange={(e) => {
                  setSelectedUnitIndex(parseInt(e.target.value));
                  setQuantity(1); // Reset quantity when changing unit
                }}
                className="border rounded px-3 py-2 w-64"
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
              <label className="block mb-2 font-medium">Số lượng:</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-20 text-center border rounded-lg py-2"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-gray-100"
                >
                  +
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
