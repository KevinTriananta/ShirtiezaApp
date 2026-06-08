import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ProductCard from '@features/products/components/ProductCard';
import { categoryService } from '@shared/api/categoryService';
import { productService } from '@shared/api/productService';
import type { Category, Product } from '@shared/types';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { if (slug) loadCategory(); }, [slug]);

  const loadCategory = async () => {
    try {
      setIsLoading(true);
      const catRes = await categoryService.getCategoryBySlug(slug!);
      setCategory(catRes.data);
      const prodRes = await productService.getProductsByCategory(catRes.data.id);
      const productData = prodRes.data;
      setProducts(Array.isArray(productData) ? productData : productData.data || []);
    } catch (error) {
      console.error('Failed to load category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16 lg:pt-[72px]">
      <div className="border-b border-neutral-100 bg-neutral-950 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 pt-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-colors duration-300 group"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" /> Back to Categories
          </Link>
          {category && (
            <div className="grid gap-10 py-12 lg:grid-cols-[1fr_320px] lg:items-end lg:py-20">
              <div>
                <p className="mb-4 text-[10px] font-black uppercase tracking-[0.34em] text-neutral-500">
                  {category.collection?.name || 'Category'}
                </p>
                <h1 className="max-w-4xl text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl lg:text-7xl">
                  {category.name}
                </h1>
              </div>
              <div className="border-t border-white/10 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                <p className="text-sm leading-relaxed text-neutral-400">
                  {category.description || 'A clean edit of pieces selected for everyday wear.'}
                </p>
                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.28em] text-neutral-600">
                  {products.length} pieces
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] skeleton rounded-2xl mb-4" />
                <div className="h-3 w-16 skeleton mb-2" />
                <div className="h-4 w-32 skeleton" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-neutral-400 text-sm uppercase tracking-[0.15em] mb-4">No products in this category</p>
            <Link to="/products" className="text-[11px] font-bold uppercase tracking-[0.2em] text-black bg-neutral-100 px-6 py-3 rounded-xl hover:bg-neutral-200 transition-all duration-200 inline-block">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
