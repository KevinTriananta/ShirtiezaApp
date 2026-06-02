import { Link } from 'react-router-dom';
import type { Category, Product } from '@shared/types';

interface CategoryGridProps {
  categories: Category[];
  products: Product[];
}

export default function CategoryGrid({ categories, products }: CategoryGridProps) {
  const featuredCards = buildArchiveCards(categories).map((category) => ({
    ...category,
    displayProduct: getFirstProductForCategory(category, products),
  }));

  return (
    <section className="bg-white py-12 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-12 animate-fade-in-up">
          <div>
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.35em] text-neutral-400">Browse</p>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-black sm:text-4xl lg:text-5xl">Shop Category</h2>
          </div>
          <Link to="/categories" className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest border border-neutral-200 px-4 py-2.5 bg-white hover:border-black transition-all">View All</Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {featuredCards.map((category, index) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group relative min-h-[240px] overflow-hidden rounded-[26px] bg-neutral-950 p-5 text-white transition-all duration-300 hover:-translate-y-1 hover:border-black/15 hover:shadow-2xl hover:shadow-black/10 sm:min-h-[300px] sm:p-6"
            >
              {category.displayProduct?.image ? (
                <img
                  src={category.displayProduct.image}
                  alt={category.displayProduct.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-neutral-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/28 to-black/8" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),transparent_36%)] opacity-60" />

              <div className="flex items-start justify-between gap-4">
                <span className="relative z-10 font-mono text-[11px] text-white/55">{String(index + 1).padStart(2, '0')}</span>
                <span className="relative z-10 rounded-full border border-white/25 bg-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/75 backdrop-blur transition-colors group-hover:border-white/45 group-hover:text-white">
                  {category.slug}
                </span>
              </div>

              <div className="absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6">
                <h3 className="max-w-[12rem] text-[2rem] font-black uppercase leading-[0.85] tracking-tight text-white drop-shadow-sm sm:text-[2.65rem]">
                  {category.name}
                </h3>
                <p className="mt-4 max-w-[15rem] text-xs font-medium leading-relaxed text-white/70 sm:text-sm">
                  {category.description}
                </p>
                {category.displayProduct?.name && (
                  <p className="mt-3 max-w-[14rem] truncate text-[10px] font-black uppercase tracking-[0.22em] text-white/45">
                    {category.displayProduct.name}
                  </p>
                )}
              </div>

              <span className="absolute -right-8 -top-6 font-serif text-[4rem] italic leading-none tracking-[-0.12em] text-white/[0.09] transition-transform duration-300 group-hover:-rotate-3 sm:text-[5rem]">
                shop
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function buildArchiveCards(categories: Category[]) {
  const preferredSlugs = ['hoodie', 'caps-bags', 'trending', 'outwear', 'outerwear', 'accessories'];
  const orderedCategories = preferredSlugs
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter(Boolean) as Category[];
  const remainingCategories = categories.filter((category) => !orderedCategories.some((item) => item.id === category.id));
  return [...orderedCategories, ...remainingCategories].slice(0, 8).map((category) => ({
    ...category,
    description: archiveDescription(category),
  }));
}

function archiveDescription(category: Category) {
  const descriptions: Record<string, string> = {
    hoodie: 'Comfort, style, and attitude in every piece.',
    'caps-bags': 'Complete your look with the perfect touch.',
    trending: 'The hottest items right now.',
    outwear: 'Layer up. Stand out.',
    accessories: 'Small details, big difference.',
  };
  return descriptions[category.slug] || category.description || 'Built for your everyday rotation.';
}

function getFirstProductForCategory(category: Category, products: Product[]) {
  return products
    .filter((product) => product.category?.id === category.id || (product as any).category_id === category.id)
    .sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime())[0];
}
