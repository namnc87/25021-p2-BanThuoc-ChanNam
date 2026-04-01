// AddressesList - Client Component for interactive address management
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addAddressAction, deleteAddressAction, setDefaultAddressAction } from '@/actions/user';

export default function AddressesList({ addresses: initialAddresses }) {
  const router = useRouter();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    fullAddress: '',
    isDefault: false,
  });

  const validateAddress = () => {
    const errors = {};
    if (!formData.recipientName.trim()) errors.recipientName = 'Vui lòng nhập họ tên người nhận';
    if (!formData.recipientPhone.trim()) errors.recipientPhone = 'Vui lòng nhập số điện thoại';
    else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.recipientPhone)) {
      errors.recipientPhone = 'Số điện thoại không hợp lệ';
    }
    if (!formData.fullAddress.trim()) errors.fullAddress = 'Vui lòng nhập địa chỉ đầy đủ';
    return errors;
  };

  const handleAddAddress = (formFormData) => {
    const errors = validateAddress();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    startTransition(async () => {
      formFormData.set('isDefault', formData.isDefault ? 'on' : '');
      const result = await addAddressAction(formFormData);

      if (result.success) {
        window.location.reload();
      } else if (result.requiresAuth) {
        alert('⚠️ ' + result.message);
        router.push('/login?redirect=/account/addresses');
      } else {
        alert(result.message || 'Không thể thêm địa chỉ');
      }
    });
  };

  const handleSetDefault = (addressId) => {
    startTransition(async () => {
      const success = await setDefaultAddressAction(addressId);
      if (success) {
        window.location.reload();
      } else {
        // Check if it's an auth error by trying again
        const result = await setDefaultAddressAction(addressId);
        if (result?.requiresAuth) {
          alert('⚠️ ' + result.message);
          router.push('/login?redirect=/account/addresses');
        } else {
          alert('Lỗi khi cập nhật địa chỉ mặc định');
        }
      }
    });
  };

  const handleDelete = (addressId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;

    startTransition(async () => {
      const success = await deleteAddressAction(addressId);
      if (success) {
        window.location.reload();
      } else {
        // Check if it's an auth error
        const result = await deleteAddressAction(addressId);
        if (result?.requiresAuth) {
          alert('⚠️ ' + result.message);
          router.push('/login?redirect=/account/addresses');
        } else {
          alert('Không thể xóa địa chỉ');
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Danh sách địa chỉ</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showAddForm ? 'Hủy' : '+ Thêm địa chỉ mới'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-6 border">
          <h4 className="text-lg font-bold mb-4">Thêm địa chỉ mới</h4>
          <form action={handleAddAddress} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Họ tên người nhận *</label>
              <input
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                className={`w-full p-3 border rounded-lg ${formErrors.recipientName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nhập họ tên người nhận"
              />
              {formErrors.recipientName && <p className="text-red-500 text-sm mt-1">{formErrors.recipientName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Số điện thoại *</label>
              <input
                type="tel"
                name="recipientPhone"
                value={formData.recipientPhone}
                onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                className={`w-full p-3 border rounded-lg ${formErrors.recipientPhone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nhập số điện thoại"
              />
              {formErrors.recipientPhone && <p className="text-red-500 text-sm mt-1">{formErrors.recipientPhone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Địa chỉ đầy đủ *</label>
              <textarea
                name="fullAddress"
                rows="3"
                value={formData.fullAddress}
                onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                className={`w-full p-3 border rounded-lg ${formErrors.fullAddress ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nhập địa chỉ đầy đủ"
              ></textarea>
              {formErrors.fullAddress && <p className="text-red-500 text-sm mt-1">{formErrors.fullAddress}</p>}
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isDefault" className="text-sm font-medium text-gray-600">
                Đặt làm địa chỉ mặc định
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isPending ? 'Đang lưu...' : 'Lưu địa chỉ'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ recipientName: '', recipientPhone: '', fullAddress: '', isDefault: false });
                  setFormErrors({});
                }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có địa chỉ</h3>
          <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ nào trong danh sách</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Thêm địa chỉ mới
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 ${address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            >
              {address.isDefault && (
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs mb-2">
                  Mặc định
                </span>
              )}
              <p className="font-medium">{address.recipientName}</p>
              <p className="text-gray-600">{address.recipientPhone}</p>
              <p className="text-gray-600 mt-1">{address.fullAddress}</p>
              <div className="flex gap-2 mt-3">
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Đặt mặc định
                  </button>
                )}
                <button
                  onClick={() => handleDelete(address.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
