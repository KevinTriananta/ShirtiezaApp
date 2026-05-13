import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Category } from '../../types';

interface HomeCategoriesProps {
  categories: Category[];
}

export default function HomeCategories({ categories }: HomeCategoriesProps) {
  return (
    <section className="py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-4 animate-slide-right">
              Curated Selection
            </p>
            <h2 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter text-black leading-none">
              Elite Categories
            </h2>
          </div>
          <Link
            to="/categories"
            className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-neutral-400 hover:text-black transition-all"
          >
            Explore All Categories
            <div className="w-10 h-10 rounded-full border border-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
              <ArrowRight size={16} />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((category, idx) => (
            <Link
              key={category.id}
              to={`/categories/${category.slug}`}
              className="premium-card group relative p-10 flex flex-col justify-between aspect-square lg:aspect-auto h-[350px]"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">{category.icon || '👕'}</div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-black mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                  {category.description}
                </p>
              </div>
              <ArrowUpRight
                size={24}
                className="absolute top-10 right-10 text-neutral-200 group-hover:text-black group-hover:rotate-12 transition-all duration-500"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
