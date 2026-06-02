import api from '@shared/lib/api';
import type { WishlistItem } from '@shared/types';

interface ApiResponse<T> {
  message: string;
  data: T;
  code: number;
}

export const wishlistService = {
  getWishlist: async () => {
    const response = await api.get<ApiResponse<WishlistItem[]>>('/wishlist');
    return response.data;
  },

  addWishlistItem: async (productId: number) => {
    const response = await api.post<ApiResponse<WishlistItem>>('/wishlist', { product_id: productId });
    return response.data;
  },

  removeWishlistItem: async (productId: number) => {
    const response = await api.delete<ApiResponse<null>>(`/wishlist/${productId}`);
    return response.data;
  },
};
