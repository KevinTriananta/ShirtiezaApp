import api from '../lib/api';

interface CollectionResponse {
  message: string;
  data: any;
  code: number;
}

interface CollectionsResponse {
  message: string;
  data: any[];
  code: number;
}

export const collectionService = {
  getAllCollections: async () => {
    const response = await api.get<CollectionsResponse>('/collections');
    return response.data;
  },

  getCollectionById: async (id: number) => {
    const response = await api.get<CollectionResponse>(`/collections/${id}`);
    return response.data;
  },

  getCollectionBySlug: async (slug: string) => {
    const response = await api.get<CollectionResponse>(`/collections/slug/${slug}`);
    return response.data;
  },

  createCollection: async (data: any) => {
    const response = await api.post<CollectionResponse>('/admin/collections', data);
    return response.data;
  },

  updateCollection: async (id: number, data: any) => {
    const response = await api.put<CollectionResponse>(`/admin/collections/${id}`, data);
    return response.data;
  },

  deleteCollection: async (id: number) => {
    const response = await api.delete<CollectionResponse>(`/admin/collections/${id}`);
    return response.data;
  },

  addProductToCollection: async (collectionId: number, productId: number) => {
    const response = await api.post<CollectionResponse>(
      `/admin/collections/${collectionId}/products/${productId}`
    );
    return response.data;
  },

  removeProductFromCollection: async (collectionId: number, productId: number) => {
    const response = await api.delete<CollectionResponse>(
      `/admin/collections/${collectionId}/products/${productId}`
    );
    return response.data;
  },
};
