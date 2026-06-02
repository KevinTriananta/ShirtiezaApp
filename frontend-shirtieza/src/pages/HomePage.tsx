import { useEffect, useState } from 'react';
import CategoryGrid from '@features/home/components/CategoryGrid';
import ExclusiveDrop from '@features/home/components/ExclusiveDrop';
import FeaturedProducts from '@features/home/components/FeaturedProducts';
import Features from '@features/home/components/Features';
import Hero from '@features/home/components/Hero';
import Marquee from '@features/home/components/Marquee';
import Newsletter from '@features/home/components/Newsletter';
import PromoTiles from '@features/home/components/PromoTiles';
import { categoryService } from '@shared/api/categoryService';
import { collectionService } from '@shared/api/collectionService';
import { productService } from '@shared/api/productService';
import type { Product, Category } from '@shared/types';

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsRes, categoriesRes, newArrivalsRes] = await Promise.all([
        productService.getAllProducts({ page_size: 24, sort_by: 'newest' }),
        categoryService.getAllCategories(),
        collectionService.getCollectionBySlug('new-arrivals').catch(() => null),
      ]);

      const products = productsRes.data?.data || [];
      const selectedNewArrivals = newArrivalsRes?.data?.products || [];
      setProducts(products);
      setNewArrivals(selectedNewArrivals.length ? selectedNewArrivals.slice(0, 4) : products.slice(0, 4));
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Failed to load homepage data:', error);
      setProducts([]);
      setNewArrivals([]);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Marquee />
      <FeaturedProducts title="New Arrivals" products={newArrivals} isLoading={isLoading} />
      <PromoTiles />
      <CategoryGrid categories={categories} products={products} />
      <ExclusiveDrop product={newArrivals[0]} />
      <Features />
      <Newsletter />
    </div>
  );
}
