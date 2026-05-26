import { useEffect, useState } from 'react';
import type { Product, Category } from '../types';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { collectionService } from '../services/collectionService';
import Hero from '../components/home/Hero';
import Marquee from '../components/home/Marquee';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Features from '../components/home/Features';
import Newsletter from '../components/home/Newsletter';
import ExclusiveDrop from '../components/home/ExclusiveDrop';
import PromoTiles from '../components/home/PromoTiles';

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
