// HeaderClient - Client Component for Search
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function HeaderClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full md:w-1/3">
      <div className="relative group">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm thuốc theo tên..."
          className="w-full px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent focus:bg-white text-sm placeholder:text-slate-400 group-hover:border-sky-300"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-sky-600 bg-white hover:bg-sky-50 w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
