import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../config/env';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token and role to requests if they exist
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  const userJson = localStorage.getItem('auth_user');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (userJson) {
    try {
      const user = JSON.parse(userJson);
      if (user.role) {
        config.headers['X-User-Role'] = user.role;
      }
    } catch (e) {
      console.error('Failed to parse user from local storage');
    }
  }
  
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
