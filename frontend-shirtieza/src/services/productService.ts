import api from '../lib/api';

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
    return response.data;
  },

  getFeaturedProducts: async () => {
    const response = await api.get<ProductResponse>('/products/featured');
    return response.data;
  },

  getProductById: async (id: number) => {
    const response = await api.get<ProductResponse>(`/products/${id}`);
    return response.data;
  },

  getProductBySlug: async (slug: string) => {
    const response = await api.get<ProductResponse>(`/products/slug/${slug}`);
    return response.data;
  },

  getProductsByCategory: async (categoryId: number, params?: Omit<GetProductsParams, 'category'>) => {
    const response = await api.get<ProductsResponse>(`/products/category/${categoryId}`, { params });
    return response.data;
  },

  getProductsByCollection: async (collectionId: number) => {
    const response = await api.get<ProductsResponse>(`/products/collection/${collectionId}`);
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
