import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import type { Product, Category } from '../types';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductCard from '../components/common/ProductCard';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const sortBy = searchParams.get('sort_by') || 'newest';

  useEffect(() => {
    loadData();
    loadCategories();
  }, [page, category, search, sortBy]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const categoryId = category ? parseInt(category) : undefined;
      const response = await productService.getAllProducts({
        page,
        page_size: 12,
        category: categoryId,
        search: search || undefined,
        sort_by: sortBy,
      });
      setProducts(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleCategoryChange = (categoryId: number | null) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId) {
      params.set('category', categoryId.toString());
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort_by', newSort);
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSearchParams(params);
  };

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
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
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
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-[12px] font-medium transition-all duration-200 ${
                    !category
                      ? 'text-black font-bold bg-neutral-100'
                      : 'text-neutral-500 hover:text-black hover:bg-neutral-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-[12px] font-medium transition-all duration-200 ${
                      category === cat.id.toString()
                        ? 'text-black font-bold bg-neutral-100'
                        : 'text-neutral-500 hover:text-black hover:bg-neutral-50'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
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
                <button
                  onClick={() => { handleCategoryChange(null); setShowFilters(false); }}
                  className={`block w-full text-left py-3 px-4 rounded-xl text-sm transition-all duration-200 ${
                    !category ? 'font-bold text-black bg-neutral-100' : 'text-neutral-500 hover:bg-neutral-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { handleCategoryChange(cat.id); setShowFilters(false); }}
                    className={`block w-full text-left py-3 px-4 rounded-xl text-sm transition-all duration-200 ${
                      category === cat.id.toString() ? 'font-bold text-black bg-neutral-100' : 'text-neutral-500 hover:bg-neutral-50'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <div className="aspect-[3/4] skeleton mb-4 rounded-2xl" />
                    <div className="h-3 w-16 skeleton mb-2" />
                    <div className="h-4 w-32 skeleton mb-2" />
                    <div className="h-4 w-20 skeleton" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-neutral-400 text-sm uppercase tracking-[0.15em] mb-4">No products found</p>
                <Link
                  to="/products"
                  className="text-[11px] font-bold uppercase tracking-[0.2em] text-black bg-neutral-100 px-6 py-3 rounded-xl hover:bg-neutral-200 transition-all duration-200 inline-block"
                >
                  Clear Filters
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10 mb-12">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-8">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-neutral-200 hover:border-black hover:bg-neutral-50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      if (pageNum < page - 1 || pageNum > page + 1) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl text-[12px] font-semibold transition-all duration-200 ${
                            pageNum === page
                              ? 'bg-black text-white shadow-lg shadow-black/10'
                              : 'border border-neutral-200 text-neutral-600 hover:border-black'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-neutral-200 hover:border-black hover:bg-neutral-50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
