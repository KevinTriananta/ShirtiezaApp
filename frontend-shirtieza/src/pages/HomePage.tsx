import { useEffect, useState } from 'react';
import type { Product, Category } from '../types';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import Hero from '../components/home/Hero';
import Marquee from '../components/home/Marquee';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Features from '../components/home/Features';
import Newsletter from '../components/home/Newsletter';
import PromoBanner from '../components/home/PromoBanner';
import ExclusiveDrop from '../components/home/ExclusiveDrop';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [featuredRes, productsRes, categoriesRes] = await Promise.all([
        productService.getFeaturedProducts(),
        productService.getAllProducts({ page_size: 8, sort_by: 'newest' }),
        categoryService.getAllCategories(),
      ]);

      setFeaturedProducts(featuredRes.data || []);
      setNewArrivals(productsRes.data?.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Failed to load homepage data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PromoBanner />
      <Hero />
      <Marquee />
      <FeaturedProducts title="New Arrivals" products={newArrivals} isLoading={isLoading} />
      <CategoryGrid categories={categories} />
      <ExclusiveDrop />
      <FeaturedProducts title="Curated for You" products={featuredProducts} isLoading={isLoading} />
      <Features />
      <Newsletter />
    </div>
  );
}