import { Link } from 'react-router-dom';
import type { Category } from '../../types';

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-4">Browse by Genre</p>
          <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-black">The Archives</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 5).map((category, idx) => (
            <Link
              key={category.id}
              to={`/categories/${category.slug}`}
              className={`group relative overflow-hidden rounded-[32px] bg-neutral-100 ${idx === 0 ? 'lg:col-span-2 lg:row-span-2 aspect-[4/3] lg:aspect-auto' : 'aspect-square'
                }`}
            >
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500 z-10" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12 z-20">
                <span className="text-4xl lg:text-6xl mb-4 group-hover:scale-110 transition-transform duration-500 block w-fit">
                  {category.icon || '👕'}
                </span>
                <h3 className="text-xl lg:text-3xl font-black text-white uppercase tracking-tighter drop-shadow-lg">
                  {category.name}
                </h3>
                <p className="text-white/80 text-[10px] lg:text-xs font-bold uppercase tracking-widest mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}

          <Link
            to="/categories"
            className="group relative overflow-hidden rounded-[32px] bg-black aspect-square flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-500 mb-4">
              <span className="text-2xl">→</span>
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-widest">All Categories</h3>
          </Link>
        </div>
      </div>
    </section>
  );
}
