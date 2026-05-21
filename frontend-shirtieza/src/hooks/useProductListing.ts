import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Category, Product } from '../types';
import { categoryService } from '../services/categoryService';
import { collectionService } from '../services/collectionService';
import { productService } from '../services/productService';
import { demoCategories, demoProducts } from '../data/demoData';

export function useProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const collection = searchParams.get('collection');
  const sortBy = searchParams.get('sort_by') || 'newest';

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [page, category, search, sortBy, collection]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      if (collection) {
        const colRes = await collectionService.getCollectionBySlug(collection);
        const prodRes = await productService.getProductsByCollection(colRes.data.id);
        setProducts(prodRes.data.data || []);
        setTotalPages(1);
        return;
      }

      const response = await productService.getAllProducts({
        page,
        page_size: 12,
        category: category ? parseInt(category) : undefined,
        search: search || undefined,
        sort_by: sortBy,
      });
      setProducts(response.data.data || []);
      setTotalPages(response.data.total_pages || 1);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts(demoProducts);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data?.length ? response.data : demoCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setCategories(demoCategories);
    }
  };

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    setSearchParams(params);
  };

  const setPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', nextPage.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSearchParams(params);
  };

  return {
    products,
    categories,
    isLoading,
    page,
    totalPages,
    selectedCategory: category,
    sortBy,
    setCategory: (categoryId: number | null) => updateParam('category', categoryId ? categoryId.toString() : null),
    setSortBy: (value: string) => updateParam('sort_by', value),
    setPage,
  };
}
