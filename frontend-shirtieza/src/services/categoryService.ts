import api from '../lib/api';

interface CategoryResponse {
  message: string;
  data: any;
  code: number;
}

interface CategoriesResponse {
  message: string;
  data: any[];
  code: number;
}

export const categoryService = {
  getAllCategories: async () => {
    const response = await api.get<CategoriesResponse>('/categories');
    return response.data;
  },

  getCategoryById: async (id: number) => {
    const response = await api.get<CategoryResponse>(`/categories/${id}`);
    return response.data;
  },

  getCategoryBySlug: async (slug: string) => {
    const response = await api.get<CategoryResponse>(`/categories/slug/${slug}`);
    return response.data;
  },

  getCategoryStats: async (id: number) => {
    const response = await api.get<CategoryResponse>(`/categories/${id}/stats`);
    return response.data;
  },

  createCategory: async (data: any) => {
    const response = await api.post<CategoryResponse>('/admin/categories', data);
    return response.data;
  },

  updateCategory: async (id: number, data: any) => {
    const response = await api.put<CategoryResponse>(`/admin/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number) => {
    const response = await api.delete<CategoryResponse>(`/admin/categories/${id}`);
    return response.data;
  },
};
