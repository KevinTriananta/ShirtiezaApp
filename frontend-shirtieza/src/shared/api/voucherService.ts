import api from '@shared/lib/api';
import type { UserVoucher, Voucher } from '@shared/types';

interface ApiResponse<T> {
  message: string;
  data: T;
  code: number;
}

export const voucherService = {
  getActiveVouchers: async () => {
    const response = await api.get<ApiResponse<Voucher[]>>('/vouchers');
    return response.data;
  },

  getUserVouchers: async () => {
    const response = await api.get<ApiResponse<UserVoucher[]>>('/vouchers/me');
    return response.data;
  },

  claimVoucher: async (voucherId: number) => {
    const response = await api.post<ApiResponse<UserVoucher>>(`/vouchers/${voucherId}/claim`);
    return response.data;
  },

  getAdminVouchers: async () => {
    const response = await api.get<ApiResponse<Voucher[]>>('/admin/vouchers');
    return response.data;
  },

  createVoucher: async (data: Partial<Voucher>) => {
    const response = await api.post<ApiResponse<Voucher>>('/admin/vouchers', data);
    return response.data;
  },

  updateVoucher: async (id: number, data: Partial<Voucher>) => {
    const response = await api.put<ApiResponse<Voucher>>(`/admin/vouchers/${id}`, data);
    return response.data;
  },

  deleteVoucher: async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(`/admin/vouchers/${id}`);
    return response.data;
  },
};
