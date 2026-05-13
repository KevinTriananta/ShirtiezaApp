import api from '../lib/api';

interface UserProfile {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

interface UserResponse {
  message: string;
  data: any;
  code: number;
}

interface OrdersResponse {
  message: string;
  data: any[];
  code: number;
}

export const userService = {
  getUserProfile: async (id: number) => {
    const response = await api.get<UserResponse>(`/users/${id}`);
    return response.data;
  },

  updateUserProfile: async (id: number, data: UserProfile) => {
    const response = await api.put<UserResponse>(`/users/${id}`, data);
    return response.data;
  },

  getUserOrders: async (id: number) => {
    const response = await api.get<OrdersResponse>(`/users/${id}/orders`);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get<OrdersResponse>('/admin/users');
    return response.data;
  },
};
