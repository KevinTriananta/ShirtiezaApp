import api from '../lib/api';

interface CartResponse {
  message: string;
  data: any;
  code: number;
}

interface AddToCartData {
  product_id: number;
  quantity: number;
}

interface UpdateCartItemData {
  quantity: number;
}

export const cartService = {
  getUserCart: async (userId: number) => {
    const response = await api.get<CartResponse>(`/cart/${userId}`);
    return response.data;
  },

  addToCart: async (userId: number, data: AddToCartData) => {
    const response = await api.post<CartResponse>(`/cart/${userId}/add`, data);
    return response.data;
  },

  updateCartItem: async (itemId: number, data: UpdateCartItemData) => {
    const response = await api.put<CartResponse>(`/cart/item/${itemId}`, data);
    return response.data;
  },

  removeFromCart: async (itemId: number) => {
    const response = await api.delete<CartResponse>(`/cart/item/${itemId}`);
    return response.data;
  },

  clearCart: async (userId: number) => {
    const response = await api.delete<CartResponse>(`/cart/${userId}/clear`);
    return response.data;
  },
};
