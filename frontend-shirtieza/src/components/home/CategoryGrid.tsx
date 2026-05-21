import { Link } from 'react-router-dom';
import type { Category } from '../../types';

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const featuredCards = buildArchiveCards(categories);

  return (
    <section className="py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-14 animate-fade-in-up">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.55em] text-neutral-400">Browse by Genre</p>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-black sm:text-4xl lg:text-5xl">The Archives</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[230px]">
          {featuredCards.map((category, idx) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className={`group relative h-[280px] overflow-hidden rounded-[28px] bg-neutral-950 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/15 sm:h-[300px] lg:h-auto ${archiveCardClass(idx)}`}
            >
              <img
                src={category.image || archiveFallbackImage(category.slug)}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
              <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/0" />
              <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-7 lg:p-8">
                <h3 className="max-w-[13rem] text-2xl font-black uppercase leading-none tracking-tighter text-white drop-shadow-lg sm:text-3xl">
                  {category.name}
                </h3>
                <p className="mt-3 max-w-[13rem] text-sm font-bold leading-tight text-white/90 sm:text-[15px]">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}

          <Link
            to="/products"
            className="group relative flex h-[280px] flex-col items-center justify-center overflow-hidden rounded-[28px] bg-black p-8 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/15 sm:h-[300px] lg:col-span-4 lg:h-auto"
          >
            <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-full border border-white/25 text-3xl text-white transition-all duration-500 group-hover:bg-white group-hover:text-black">
              →
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white">All Categories</h3>
            <p className="mt-4 max-w-[12rem] text-sm font-black leading-tight text-white/85">Explore everything we have to offer.</p>
          </Link>
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
  return [...orderedCategories, ...remainingCategories].slice(0, 5).map((category) => ({
    ...category,
    description: archiveDescription(category),
  }));
}

function archiveCardClass(index: number) {
  const classes = [
    'sm:col-span-2 lg:col-span-7 lg:row-span-2',
    'lg:col-span-5',
    'lg:col-span-5',
    'lg:col-span-4',
    'lg:col-span-4',
  ];
  return classes[index] || 'lg:col-span-4';
}

function archiveDescription(category: Category) {
  const descriptions: Record<string, string> = {
    hoodie: 'Comfort, style, and attitude in every piece.',
    'caps-bags': 'Complete your look with the perfect touch.',
    trending: 'The hottest items right now.',
    outwear: 'Layer up. Stand out.',
    outerwear: 'Layer up. Stand out.',
    accessories: 'Small details, big difference.',
  };
  return descriptions[category.slug] || category.description || 'Built for your everyday rotation.';
}

function archiveFallbackImage(slug: string) {
  const images: Record<string, string> = {
    hoodie: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1400&auto=format&fit=crop',
    'caps-bags': 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1200&auto=format&fit=crop',
    trending: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1200&auto=format&fit=crop',
    outwear: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200&auto=format&fit=crop',
    outerwear: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200&auto=format&fit=crop',
    accessories: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop',
  };
  return images[slug] || 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop';
}