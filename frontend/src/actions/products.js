// Server Actions for Products
'use server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Fetch all products
export async function getProducts() {
  try {
    const res = await fetch(`${API_URL}/products`, {
      cache: 'no-store',
    });

    if (res.ok) {
      return await res.json();
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

// Fetch product by ID
export async function getProductById(id) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      cache: 'no-store',
    });

    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

// Fetch categories
export async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      cache: 'no-store',
    });

    if (res.ok) {
      return await res.json();
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}
