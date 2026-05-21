import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductFilters from '../components/products/ProductFilters';
import ProductGridState from '../components/products/ProductGridState';
import ProductPagination from '../components/products/ProductPagination';
import { useProductListing } from '../hooks/useProductListing';

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const listing = useProductListing();

  return (
    <div className="min-h-screen bg-white pt-16 lg:pt-[72px]">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-[11px] tracking-wide">
            <Link to="/" className="text-neutral-400 hover:text-black transition-colors duration-200">Home</Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-600 font-medium">Products</span>
          </div>
        </div>
      </div>

      {/* Title + Controls */}
      <div className="border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-neutral-400 mb-2">Shop</p>
              <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-black">
                All Products
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 border border-neutral-200 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-600 hover:border-black hover:text-black transition-all duration-200"
              >
                <SlidersHorizontal size={14} />
                Filters
              </button>
              <select
                value={listing.sortBy}
                onChange={(e) => listing.setSortBy(e.target.value)}
                className="border border-neutral-200 px-4 py-2.5 rounded-xl text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-600 bg-white focus:outline-none focus:border-black transition-all duration-200 appearance-none cursor-pointer pr-8"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex gap-8 lg:gap-12">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-28">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-5">
                Categories
              </h3>
              <div className="space-y-1">
                <ProductFilters categories={listing.categories} selectedCategory={listing.selectedCategory} onCategoryChange={listing.setCategory} className="space-y-1 text-[12px]" />
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-white animate-slide-down overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                <h3 className="text-sm font-bold uppercase tracking-[0.15em]">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-2 rounded-xl hover:bg-neutral-100 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="px-6 py-4 space-y-1">
                <ProductFilters categories={listing.categories} selectedCategory={listing.selectedCategory} onCategoryChange={listing.setCategory} onClose={() => setShowFilters(false)} className="space-y-1 text-sm" />
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <ProductGridState isLoading={listing.isLoading} products={listing.products} />
            {!listing.isLoading && listing.products.length > 0 && <ProductPagination page={listing.page} totalPages={listing.totalPages} onPageChange={listing.setPage} />}
          </div>
        </div>
      </div>
    </div>
  );
}
