// Server Actions for Cart
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Helper to get cookie header
async function getCookieHeader() {
  const cookieStore = await cookies();
  return cookieStore.toString();
}

// Fetch cart items
export async function getCartItems() {
  try {
    const cookie = await getCookieHeader();
    const res = await fetch(`${API_URL}/cart`, {
      headers: {
        Cookie: cookie,
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(3000), // Timeout after 3 seconds
    });

    if (res.ok) {
      return await res.json();
    }
    return [];
  } catch (error) {
    // Silently fail - don't log connection errors to console
    return [];
  }
}

// Get cart count
export async function getCartCount() {
  try {
    const items = await getCartItems();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  } catch {
    return 0;
  }
}

// Add to cart
export async function addToCartAction(productId, unit, quantity, price) {
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

    const res = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
      body: JSON.stringify({ productId, unit, quantity, price }),
    });

    if (res.ok) {
      // Revalidate cart paths to update the cart count in header
      revalidatePath('/cart');
      revalidatePath('/');
      return { success: true, message: 'Đã thêm vào giỏ hàng' };
    }

    const data = await res.json();
    return { success: false, message: data.message || 'Không thể thêm vào giỏ hàng' };
  } catch (error) {
    console.error('Add to cart failed:', error);
    return { success: false, message: 'Lỗi kết nối server' };
  }
}

// Update cart item quantity
export async function updateCartItemAction(itemId, quantity) {
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

    const res = await fetch(`${API_URL}/cart/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
      body: JSON.stringify({ quantity }),
    });

    if (res.ok) {
      return { success: true };
    }

    const data = await res.json();
    return { success: false, message: data.message };
  } catch (error) {
    console.error('Update cart failed:', error);
    return { success: false, message: 'Lỗi kết nối server' };
  }
}

// Remove cart item
export async function removeCartItemAction(itemId) {
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

    const res = await fetch(`${API_URL}/cart/${itemId}`, {
      method: 'DELETE',
      headers: {
        Cookie: cookie,
      },
    });

    if (res.ok) {
      return { success: true };
    }

    return { success: false };
  } catch (error) {
    console.error('Remove cart item failed:', error);
    return { success: false };
  }
}

// Clear cart
export async function clearCartAction() {
  try {
    const cookie = await getCookieHeader();
    const res = await fetch(`${API_URL}/cart`, {
      method: 'DELETE',
      headers: {
        Cookie: cookie,
      },
    });

    return res.ok;
  } catch (error) {
    console.error('Clear cart failed:', error);
    return false;
  }
}
