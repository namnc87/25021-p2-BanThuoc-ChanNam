// AddressesList - Client Component for interactive address management
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addAddressAction, deleteAddressAction, setDefaultAddressAction } from '@/actions/user';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { MapPin, Star } from 'lucide-react';

export default function AddressesList({ addresses }) {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formErrors, setFormErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
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
        router.refresh();
        setShowAddForm(false);
        setFormData({ recipientName: '', recipientPhone: '', fullAddress: '', isDefault: false });
        setMessage({ type: 'success', text: 'Thêm địa chỉ thành công!' });
        setTimeout(() => setMessage(null), 3000);
      } else if (result.requiresAuth) {
        setMessage({ type: 'error', text: result.message });
        setTimeout(() => {
          router.push('/login?redirect=/account/addresses');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: result.message || 'Không thể thêm địa chỉ' });
        setTimeout(() => setMessage(null), 3000);
      }
    });
  };

  const handleSetDefault = async (addressId) => {
    const result = await setDefaultAddressAction(addressId);
    if (result.success) {
      router.refresh();
      setMessage({ type: 'success', text: 'Đã cập nhật địa chỉ mặc định' });
      setTimeout(() => setMessage(null), 3000);
    } else if (result.requiresAuth) {
      setMessage({ type: 'error', text: result.message });
      setTimeout(() => {
        router.push('/login?redirect=/account/addresses');
      }, 1500);
    } else {
      setMessage({ type: 'error', text: result.message || 'Lỗi khi cập nhật địa chỉ mặc định' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (addressId) => {
    const result = await deleteAddressAction(addressId);
    if (result.success) {
      router.refresh();
      setMessage({ type: 'success', text: 'Đã xóa địa chỉ' });
      setTimeout(() => setMessage(null), 3000);
    } else if (result.requiresAuth) {
      setMessage({ type: 'error', text: result.message });
      setTimeout(() => {
        router.push('/login?redirect=/account/addresses');
      }, 1500);
    } else {
      setMessage({ type: 'error', text: result.message || 'Không thể xóa địa chỉ' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-3.5 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Danh sách địa chỉ</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-5 py-2.5 rounded-xl font-medium text-sm ${showAddForm ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-sm shadow-sky-100 hover:from-sky-600 hover:to-sky-700'}`}
        >
          {showAddForm ? 'Hủy' : '+ Thêm địa chỉ mới'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-slate-50 rounded-2xl p-7 border border-slate-200">
          <h4 className="text-lg font-bold mb-5 text-slate-800">Thêm địa chỉ mới</h4>
          <form action={handleAddAddress} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Họ tên người nhận *</label>
              <input
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                className={`w-full p-3.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent ${formErrors.recipientName ? 'border-red-300' : 'border-slate-200'}`}
                placeholder="Nhập họ tên người nhận"
              />
              {formErrors.recipientName && <p className="text-red-500 text-sm mt-1.5">{formErrors.recipientName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Số điện thoại *</label>
              <input
                type="tel"
                name="recipientPhone"
                value={formData.recipientPhone}
                onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                className={`w-full p-3.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent ${formErrors.recipientPhone ? 'border-red-300' : 'border-slate-200'}`}
                placeholder="Nhập số điện thoại"
              />
              {formErrors.recipientPhone && <p className="text-red-500 text-sm mt-1.5">{formErrors.recipientPhone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Địa chỉ đầy đủ *</label>
              <textarea
                name="fullAddress"
                rows="3"
                value={formData.fullAddress}
                onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                className={`w-full p-3.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent ${formErrors.fullAddress ? 'border-red-300' : 'border-slate-200'}`}
                placeholder="Nhập địa chỉ đầy đủ"
              ></textarea>
              {formErrors.fullAddress && <p className="text-red-500 text-sm mt-1.5">{formErrors.fullAddress}</p>}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isDefault"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="w-4 h-4 rounded accent-sky-500"
              />
              <label htmlFor="isDefault" className="text-sm font-medium text-slate-600">
                Đặt làm địa chỉ mặc định
              </label>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2.5 rounded-xl hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 font-medium text-sm shadow-sm shadow-emerald-100"
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
                className="bg-white text-slate-600 px-6 py-2.5 rounded-xl hover:bg-slate-100 font-medium text-sm border border-slate-200"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">Chưa có địa chỉ</h3>
          <p className="text-slate-500 mb-5">Bạn chưa có địa chỉ nào trong danh sách</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 py-2.5 rounded-xl hover:from-sky-600 hover:to-sky-700 font-medium text-sm shadow-sm shadow-sky-100"
          >
            + Thêm địa chỉ mới
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border-2 rounded-2xl p-5 ${address.isDefault ? 'border-sky-400 bg-sky-50/50' : 'border-slate-200 hover:border-slate-300'}`}
            >
              {address.isDefault && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs mb-3 font-semibold border border-sky-200">
                  <Star className="w-3 h-3" />
                  Mặc định
                </span>
              )}
              <p className="font-semibold text-slate-800">{address.recipientName}</p>
              <p className="text-slate-500 text-sm">{address.recipientPhone}</p>
              <p className="text-slate-500 mt-1 text-sm">{address.fullAddress}</p>
              <div className="flex gap-3 mt-4">
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-sky-600 hover:text-sky-700 text-sm font-medium"
                  >
                    Đặt mặc định
                  </button>
                )}
                <button
                  onClick={() => setConfirmDeleteId(address.id)}
                  className="text-red-400 hover:text-red-600 text-sm font-medium"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="Xóa địa chỉ"
        message="Bạn có chắc chắn muốn xóa địa chỉ này?"
        onConfirm={() => {
          if (confirmDeleteId) {
            handleDelete(confirmDeleteId);
            setConfirmDeleteId(null);
          }
        }}
        onCancel={() => setConfirmDeleteId(null)}
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
}
