// ProfileForm - Client Component for form interaction
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfileAction } from '@/actions/user';
import { Pencil } from 'lucide-react';

export default function ProfileForm({ user }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập họ tên';
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    startTransition(async () => {
      const formFormData = new FormData();
      formFormData.set('name', formData.name);
      formFormData.set('email', formData.email);
      formFormData.set('phone', formData.phone);
      formFormData.set('userId', user.id.toString());

      const result = await updateProfileAction(formFormData);

      if (result.success) {
        setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
        setIsEditing(false);
        // Update formData to reflect saved values
        setFormData({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        });
        setTimeout(() => setMessage(null), 3000);
      } else {
        if (result.requiresAuth) {
          setMessage({ type: 'error', text: result.message });
          setTimeout(() => {
            router.push('/login?redirect=/account/profile');
          }, 1500);
        } else {
          setMessage({ type: 'error', text: result.message || 'Không thể cập nhật thông tin' });
          setTimeout(() => setMessage(null), 3000);
        }
      }
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    // Reset formData to original user values
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setErrors({});
    // Ensure formData matches current user values
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-3.5 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-500 mb-1.5">Họ và tên</label>
          {isEditing ? (
            <>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full p-3.5 border rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent ${errors.name ? 'border-red-300' : 'border-slate-200'}`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1.5">{errors.name}</p>}
            </>
          ) : (
            <p className="font-medium p-3.5 bg-slate-50 rounded-xl text-slate-800">{formData.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-500 mb-1.5">Email</label>
          {isEditing ? (
            <>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full p-3.5 border rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent ${errors.email ? 'border-red-300' : 'border-slate-200'}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1.5">{errors.email}</p>}
            </>
          ) : (
            <p className="font-medium p-3.5 bg-slate-50 rounded-xl text-slate-800">{formData.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-500 mb-1.5">Số điện thoại</label>
          {isEditing ? (
            <>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full p-3.5 border rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent ${errors.phone ? 'border-red-300' : 'border-slate-200'}`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1.5">{errors.phone}</p>}
            </>
          ) : (
            <p className="font-medium p-3.5 bg-slate-50 rounded-xl text-slate-800">{formData.phone}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2.5 rounded-xl hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 font-medium text-sm shadow-sm shadow-emerald-100"
            >
              {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-xl hover:bg-slate-200 font-medium text-sm border border-slate-200"
            >
              Hủy
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleEdit}
            className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 py-2.5 rounded-xl hover:from-sky-600 hover:to-sky-700 font-medium text-sm shadow-sm shadow-sky-100 flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            Chỉnh sửa
          </button>
        )}
      </div>
    </div>
  );
}
