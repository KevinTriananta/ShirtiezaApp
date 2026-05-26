import api from '../lib/api';

interface OrderItem {
  product_id: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface CreateOrderData {
  user_id: number;
  shipping_address: string;
  shipping_city: string;
  shipping_country: string;
  shipping_zip: string;
  shipping_cost: number;
  tax: number;
  payment_method: string;
  user_voucher_id?: number;
  cart_item_ids?: number[];
  items: OrderItem[];
}

interface OrderResponse {
  message: string;
  data: any;
  code: number;
}

interface OrdersResponse {
  message: string;
  data: any[];
  code: number;
}

export const orderService = {
  createOrder: async (data: CreateOrderData) => {
    const response = await api.post<OrderResponse>('/orders', data);
    return response.data;
  },

  getOrderById: async (id: number) => {
    const response = await api.get<OrderResponse>(`/orders/${id}`);
    return response.data;
  },

  getAllOrders: async () => {
    const response = await api.get<OrdersResponse>('/admin/orders');
    return response.data;
  },

  updateOrderStatus: async (
    id: number,
    data: {
      status: string;
      payment_status?: string;
      notes?: string;
    }
  ) => {
    const response = await api.put<OrderResponse>(`/admin/orders/${id}/status`, data);
    return response.data;
  },

  cancelOrder: async (id: number) => {
    const response = await api.put<OrderResponse>(`/admin/orders/${id}/cancel`);
    return response.data;
  },

  uploadPaymentProof: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('payment_proof', file);
    const response = await api.post<OrderResponse>(`/orders/${id}/payment-proof`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getAdminStats: async () => {
    const response = await api.get<OrderResponse>('/admin/stats');
    return response.data;
  },
};
