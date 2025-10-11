import apiClient from './client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'VENDEDOR' | 'CONSULTA';
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  _count?: {
    sales: number;
  };
}

export const userApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }) => apiClient.get('/users', { params }),

  getById: (id: string) => apiClient.get(`/users/${id}`),

  create: (data: {
    email: string;
    password: string;
    name: string;
    role?: 'ADMIN' | 'VENDEDOR' | 'CONSULTA';
  }) => apiClient.post('/users', data),

  update: (
    id: string,
    data: {
      email?: string;
      name?: string;
      role?: 'ADMIN' | 'VENDEDOR' | 'CONSULTA';
      isActive?: boolean;
    }
  ) => apiClient.put(`/users/${id}`, data),

  delete: (id: string) => apiClient.delete(`/users/${id}`),

  resetPassword: (id: string, newPassword: string) =>
    apiClient.post(`/users/${id}/reset-password`, { newPassword }),
};
