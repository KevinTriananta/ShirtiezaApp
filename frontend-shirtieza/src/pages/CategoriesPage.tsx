import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { categoryService } from '@shared/api/categoryService';
import type { Category } from '@shared/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16 lg:pt-[72px]">
      <div className="border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-[11px] tracking-wide">
            <Link to="/" className="text-neutral-400 hover:text-black transition-colors duration-200">Home</Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-600 font-medium">Categories</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.35em] sm:tracking-[0.4em] text-neutral-400 mb-2">Browse</p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-black mb-8 sm:mb-10">
          Shop by Category
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] skeleton" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-neutral-400 text-sm">No categories found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                className="group relative overflow-hidden rounded-[18px] border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
              >
                <div className="flex min-h-[168px] flex-col justify-between p-5 sm:min-h-[188px] sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <p className="max-w-[9rem] text-[10px] font-black uppercase tracking-[0.28em] text-neutral-300">
                      {category.collection?.name || 'Shirtieza'}
                    </p>
                    <ArrowUpRight
                      size={18}
                      className="shrink-0 text-neutral-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black"
                    />
                  </div>
                  <div>
                    <h3 className="mb-3 text-xl font-black uppercase leading-none tracking-tight text-black sm:text-2xl">
                    {category.name}
                  </h3>
                    <p className="max-w-[14rem] text-xs leading-relaxed text-neutral-500 line-clamp-2">
                      {category.description || 'Curated pieces for your daily rotation.'}
                    </p>
                  </div>
                  <div className="mt-6 h-px w-full bg-neutral-100">
                    <span className="block h-px w-10 bg-black transition-all duration-300 group-hover:w-full" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
