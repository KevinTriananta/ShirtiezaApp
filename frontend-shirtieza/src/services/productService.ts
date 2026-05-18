import api from '../lib/api';
import type { Product } from '../types';

function normalizeProduct(product: any): Product {
  let images = product.images;
  let colors = product.colors;
  if (typeof images === 'string' && images.trim()) {
    try {
      images = JSON.parse(images);
    } catch {
      images = [images];
    }
  }
  if (typeof colors === 'string' && colors.trim()) {
    try {
      colors = JSON.parse(colors);
    } catch {
      colors = colors.split(',').map((color: string) => color.trim()).filter(Boolean);
    }
  }

  return {
    ...product,
    images: Array.isArray(images) ? images : undefined,
    colors: Array.isArray(colors) ? colors : undefined,
  };
}

function normalizeProducts(products: any[] = []) {
  return products.map(normalizeProduct);
}

interface GetProductsParams {
  page?: number;
  page_size?: number;
  category?: number;
  search?: string;
  sort_by?: string;
}

interface ProductsResponse {
  message: string;
  data: {
    data: any[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
  code: number;
}

interface ProductResponse {
  message: string;
  data: any;
  code: number;
}

export const productService = {
  getAllProducts: async (params?: GetProductsParams) => {
    const response = await api.get<ProductsResponse>('/products', { params });
    response.data.data.data = normalizeProducts(response.data.data.data);
    return response.data;
  },

  getFeaturedProducts: async () => {
    const response = await api.get<ProductResponse>('/products/featured');
    response.data.data = normalizeProducts(Array.isArray(response.data.data) ? response.data.data : []);
    return response.data;
  },

  getProductById: async (id: number) => {
    const response = await api.get<ProductResponse>(`/products/${id}`);
    response.data.data = normalizeProduct(response.data.data);
    return response.data;
  },

  getProductBySlug: async (slug: string) => {
    const response = await api.get<ProductResponse>(`/products/slug/${slug}`);
    response.data.data = normalizeProduct(response.data.data);
    return response.data;
  },

  getProductsByCategory: async (categoryId: number, params?: Omit<GetProductsParams, 'category'>) => {
    const response = await api.get<ProductsResponse>(`/products/category/${categoryId}`, { params });
    response.data.data = Array.isArray(response.data.data)
      ? ({ data: normalizeProducts(response.data.data), total: response.data.data.length, page: 1, page_size: response.data.data.length, total_pages: 1 } as any)
      : response.data.data;
    return response.data;
  },

  getProductsByCollection: async (collectionId: number) => {
    const response = await api.get<ProductsResponse>(`/products/collection/${collectionId}`);
    response.data.data = Array.isArray(response.data.data)
      ? ({ data: normalizeProducts(response.data.data), total: response.data.data.length, page: 1, page_size: response.data.data.length, total_pages: 1 } as any)
      : response.data.data;
    return response.data;
  },

  createProduct: async (data: any) => {
    const response = await api.post<ProductResponse>('/admin/products', data);
    return response.data;
  },

  updateProduct: async (id: number, data: any) => {
    const response = await api.put<ProductResponse>(`/admin/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: number) => {
    const response = await api.delete<ProductResponse>(`/admin/products/${id}`);
    return response.data;
  },
};
