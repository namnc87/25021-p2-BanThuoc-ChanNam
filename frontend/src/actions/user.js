// Server Actions for User/Addresses
'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Helper to get cookie header
async function getCookieHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  return token ? `access_token=${token}` : '';
}

// Get user addresses
export async function getUserAddresses() {
  try {
    const cookie = await getCookieHeader();
    const res = await fetch(`${API_URL}/addresses`, {
      headers: {
        Cookie: cookie,
      },
      cache: 'no-store',
    });

    if (res.ok) {
      return await res.json();
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch addresses:', error);
    return [];
  }
}

// Add address
export async function addAddressAction(formData) {
  try {
    const cookie = await getCookieHeader();
    
    // Check if user is authenticated first
    const authRes = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Cookie: cookie,
      },
      cache: 'no-store',
    });

    if (!authRes.ok) {
      return { 
        success: false, 
        message: 'Cần đăng nhập để thực hiện thao tác này',
        requiresAuth: true 
      };
    }
    
    const recipientName = formData.get('recipientName');
    const recipientPhone = formData.get('recipientPhone');
    const fullAddress = formData.get('fullAddress');
    const isDefault = formData.get('isDefault') === 'on';

    const res = await fetch(`${API_URL}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
      body: JSON.stringify({ recipientName, recipientPhone, fullAddress, isDefault }),
    });

    if (res.ok) {
      return { success: true };
    }

    const error = await res.json();
    return { success: false, message: error.message };
  } catch (error) {
    console.error('Add address failed:', error);
    return { success: false, message: 'Lỗi kết nối server' };
  }
}

// Delete address
export async function deleteAddressAction(addressId) {
  try {
    const cookie = await getCookieHeader();
    
    // Check if user is authenticated first
    const authRes = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Cookie: cookie,
      },
      cache: 'no-store',
    });

    if (!authRes.ok) {
      return { 
        success: false, 
        message: 'Cần đăng nhập để thực hiện thao tác này',
        requiresAuth: true 
      };
    }
    
    const res = await fetch(`${API_URL}/addresses/${addressId}`, {
      method: 'DELETE',
      headers: {
        Cookie: cookie,
      },
    });

    return res.ok;
  } catch (error) {
    console.error('Delete address failed:', error);
    return false;
  }
}

// Set default address
export async function setDefaultAddressAction(addressId) {
  try {
    const cookie = await getCookieHeader();
    
    // Check if user is authenticated first
    const authRes = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Cookie: cookie,
      },
      cache: 'no-store',
    });

    if (!authRes.ok) {
      return { 
        success: false, 
        message: 'Cần đăng nhập để thực hiện thao tác này',
        requiresAuth: true 
      };
    }
    
    const res = await fetch(`${API_URL}/addresses/${addressId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
      body: JSON.stringify({ isDefault: true }),
    });

    return res.ok;
  } catch (error) {
    console.error('Set default address failed:', error);
    return false;
  }
}

// Update user profile
export async function updateProfileAction(formData) {
  try {
    const cookie = await getCookieHeader();
    
    // Check if user is authenticated first
    const authRes = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Cookie: cookie,
      },
      cache: 'no-store',
    });

    if (!authRes.ok) {
      return { 
        success: false, 
        message: 'Cần đăng nhập để thực hiện thao tác này',
        requiresAuth: true 
      };
    }
    
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const userId = formData.get('userId');

    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
      body: JSON.stringify({ name, email, phone }),
    });

    if (res.ok) {
      return { success: true };
    }

    const error = await res.json();
    return { success: false, message: error.message };
  } catch (error) {
    console.error('Update profile failed:', error);
    return { success: false, message: 'Lỗi kết nối server' };
  }
}
