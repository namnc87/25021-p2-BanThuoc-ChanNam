// Server Actions for Authentication
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Helper function to get cookies
async function getCookieHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  return token ? `access_token=${token}` : '';
}

// Check current user authentication
export async function checkAuth() {
  try {
    const cookie = await getCookieHeader();
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Cookie: cookie,
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      return data.user || null;
    }
    return null;
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
}

// Login action
export async function loginAction(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return {
      success: false,
      message: 'Vui lòng nhập email và mật khẩu',
    };
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Block admin users from customer login
      if (data.user?.role === 'admin') {
        return {
          success: false,
          message: 'Tài khoản này không dùng được ở trang login này.',
        };
      }

      // Get Set-Cookie header
      const setCookie = res.headers.get('Set-Cookie');

      // Get cookieStore before any async operations
      const cookieStore = await cookies();

      if (setCookie) {
        // Parse and set cookies
        const cookieList = setCookie.split(',');
        cookieList.forEach((cookie) => {
          const [cookieStr] = cookie.split(';');
          const [name, value] = cookieStr.split('=');
          if (name && value) {
            cookieStore.set(name.trim(), value.trim(), {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
            });
          }
        });
      }

      redirect('/');
    }

    return {
      success: false,
      message: data.message || 'Đăng nhập thất bại',
    };
  } catch (error) {
    // Re-throw redirect errors
    if (error?.digest?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    console.error('Login failed:', error);
    return {
      success: false,
      message: 'Không thể kết nối đến server',
    };
  }
}

// Admin login action
export async function adminLoginAction(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return {
      success: false,
      message: 'Vui lòng nhập email và mật khẩu',
    };
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Check if admin
      if (data.user?.role !== 'admin') {
        return {
          success: false,
          message: 'Tài khoản này không có quyền quản trị',
        };
      }

      // Get Set-Cookie header
      const setCookie = res.headers.get('Set-Cookie');
      
      // Get cookieStore before any async operations
      const cookieStore = await cookies();
      
      if (setCookie) {
        const cookieList = setCookie.split(',');
        cookieList.forEach((cookie) => {
          const [cookieStr] = cookie.split(';');
          const [name, value] = cookieStr.split('=');
          if (name && value) {
            cookieStore.set(name.trim(), value.trim(), {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
            });
          }
        });
      }

      redirect('/admin/orders');
    }

    return {
      success: false,
      message: data.message || 'Đăng nhập thất bại',
    };
  } catch (error) {
    // Re-throw redirect errors
    if (error?.digest?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    console.error('Admin login failed:', error);
    return {
      success: false,
      message: 'Không thể kết nối đến server',
    };
  }
}

// Register action
export async function registerAction(prevState, formData) {
  const fullname = formData.get('fullname');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');

  // Validation
  const errors = {};

  if (!fullname || fullname.trim().length < 2) {
    errors.fullname = 'Họ và tên phải có ít nhất 2 ký tự';
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (!phone || !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(phone)) {
    errors.phone = 'Số điện thoại không hợp lệ';
  }

  if (!password || password.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      message: 'Vui lòng kiểm tra lại thông tin',
    };
  }

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullname, email, phone, password, confirmPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      // Set cookies if returned
      const setCookie = res.headers.get('Set-Cookie');
      
      // Get cookieStore before any async operations
      const cookieStore = await cookies();
      
      if (setCookie) {
        const cookieList = setCookie.split(',');
        cookieList.forEach((cookie) => {
          const [cookieStr] = cookie.split(';');
          const [name, value] = cookieStr.split('=');
          if (name && value) {
            cookieStore.set(name.trim(), value.trim(), {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
            });
          }
        });
      }

      redirect('/?registered=true');
    }

    return {
      success: false,
      message: data.message || 'Đăng ký thất bại',
    };
  } catch (error) {
    // Re-throw redirect errors
    if (error?.digest?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    console.error('Register failed:', error);
    return {
      success: false,
      message: 'Không thể kết nối đến server',
    };
  }
}

// Logout action
export async function logoutAction() {
  try {
    const cookie = await getCookieHeader();
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        Cookie: cookie,
      },
    });
  } catch (error) {
    console.error('Logout failed:', error);
  }

  // Clear cookies
  const cookieStore = await cookies();
  cookieStore.delete('access_token');

  redirect('/');
}
