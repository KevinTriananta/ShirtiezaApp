import { useEffect, useState } from 'react';
import { productService } from '@shared/api/productService';
import type { Product } from '@shared/types';

export function useProductDetail(slug?: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;

    let isCurrent = true;

    async function loadProduct() {
      try {
        setIsLoading(true);
        setError('');
        const response = await productService.getProductBySlug(slug!);
        if (isCurrent) setProduct(response.data);
      } catch (error) {
        console.error('Failed to load product:', error);
        if (isCurrent) setError('Product not found');
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadProduct();

    return () => {
      isCurrent = false;
    };
  }, [slug]);

  return { product, isLoading, error, setError };
}
