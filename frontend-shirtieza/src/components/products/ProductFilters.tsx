import type { Category } from '../../types';

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: number | null) => void;
  onClose?: () => void;
  className?: string;
}

export default function ProductFilters({ categories, selectedCategory, onCategoryChange, onClose, className = '' }: ProductFiltersProps) {
  const selectCategory = (categoryId: number | null) => {
    onCategoryChange(categoryId);
    onClose?.();
  };

  return (
    <div className={className}>
      <button
        onClick={() => selectCategory(null)}
        className={`block w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
          !selectedCategory ? 'text-black font-bold bg-neutral-100' : 'text-neutral-500 hover:text-black hover:bg-neutral-50'
        }`}
      >
        All Categories
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => selectCategory(cat.id)}
          className={`block w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
            selectedCategory === cat.id.toString()
              ? 'text-black font-bold bg-neutral-100'
              : 'text-neutral-500 hover:text-black hover:bg-neutral-50'
          }`}
        >
          {cat.icon} {cat.name}
        </button>
      ))}
    </div>
  );
}
