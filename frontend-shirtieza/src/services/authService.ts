import api from '../lib/api';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  zip_code?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      phone?: string;
      address?: string;
      city?: string;
      country?: string;
      avatar?: string;
      role: string;
    };
    token?: string;
  };
  code: number;
}

export const authService = {
  register: async (data: RegisterData) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data.data.token) {
      localStorage.setItem('auth_token', response.data.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data.data.token) {
      localStorage.setItem('auth_token', response.data.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('auth_user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },
};
