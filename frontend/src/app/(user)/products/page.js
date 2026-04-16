// Products Page - Server Component
import { getProducts, getCategories } from '@/actions/products';
import ProductList from './ProductList';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }) {
  const sp = await searchParams;

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  // Server-side filtering
  let filteredProducts = [...products];

  // Filter by search
  if (sp.search) {
    const searchTerm = sp.search.toLowerCase();
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      (p.description && p.description.toLowerCase().includes(searchTerm))
    );
  }

  // Filter by category
  if (sp.category) {
    filteredProducts = filteredProducts.filter(p => p.category === sp.category);
  }

  // Filter by type
  if (sp.type) {
    filteredProducts = filteredProducts.filter(p => p.type === sp.type);
  }

  // Filter by price range
  if (sp.minPrice) {
    const minPrice = parseFloat(sp.minPrice);
    filteredProducts = filteredProducts.filter(p => {
      const prices = p.units?.map(u => u.price) || [0];
      return Math.min(...prices) >= minPrice;
    });
  }

  if (sp.maxPrice) {
    const maxPrice = parseFloat(sp.maxPrice);
    filteredProducts = filteredProducts.filter(p => {
      const prices = p.units?.map(u => u.price) || [0];
      return Math.min(...prices) <= maxPrice;
    });
  }

  // Sort
  if (sp.sort) {
    switch (sp.sort) {
      case 'name-asc':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        filteredProducts.sort((a, b) => {
          const priceA = Math.min(...(a.units?.map(u => u.price) || [0]));
          const priceB = Math.min(...(b.units?.map(u => u.price) || [0]));
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => {
          const priceA = Math.min(...(a.units?.map(u => u.price) || [0]));
          const priceB = Math.min(...(b.units?.map(u => u.price) || [0]));
          return priceB - priceA;
        });
        break;
    }
  }

  return (
    <ProductList
      products={filteredProducts}
      categories={categories}
      currentFilters={{
        category: sp.category || '',
        type: sp.type || '',
        minPrice: sp.minPrice || '',
        maxPrice: sp.maxPrice || '',
        search: sp.search || '',
        sort: sp.sort || 'default',
      }}
    />
  );
}
