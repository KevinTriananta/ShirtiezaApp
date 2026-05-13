import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Category } from '../types';
import { categoryService } from '../services/categoryService';

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
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-[11px] tracking-wide">
            <Link to="/" className="text-neutral-400 hover:text-black transition-colors duration-200">Home</Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-600 font-medium">Categories</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-neutral-400 mb-2">Browse</p>
        <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-black mb-10">
          Shop by Category
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 skeleton rounded-2xl" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-neutral-400 text-sm">No categories found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                className="group relative bg-neutral-50 border border-neutral-100 rounded-2xl hover:border-neutral-200 hover:shadow-xl hover:shadow-neutral-100/80 hover:-translate-y-1 transition-all duration-400 overflow-hidden"
              >
                <div className="p-8 lg:p-10">
                  <div className="text-4xl lg:text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">{category.icon || '👕'}</div>
                  <h3 className="text-lg font-bold uppercase tracking-[0.04em] text-black mb-2 group-hover:text-neutral-700 transition-colors duration-200">
                    {category.name}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed line-clamp-2">
                    {category.description || 'Browse this collection'}
                  </p>
                </div>
                <ArrowUpRight
                  size={18}
                  className="absolute top-6 right-6 text-neutral-200 group-hover:text-black group-hover:rotate-[-8deg] transition-all duration-300"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
