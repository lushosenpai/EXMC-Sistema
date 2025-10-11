import apiClient from './client';

export interface Product {
  id: string;
  name: string;
  code: string;
  supplierId?: string;
  supplier?: {
    id: string;
    name: string;
  };
  costPrice: number;
  salePrice: number;
  percentageEnabled: boolean;
  percentageValue: number;
  image?: string;
  stock: number;
  minStock: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const productApi = {
  getAll: async (params?: PaginationParams) => {
    const { data } = await apiClient.get('/products', { params });
    return data;
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get(`/products/${id}`);
    return data.data;
  },

  create: async (formData: FormData) => {
    const { data } = await apiClient.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  update: async (id: string, formData: FormData) => {
    const { data } = await apiClient.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete(`/products/${id}`);
    return data;
  },

  getLowStock: async () => {
    const { data } = await apiClient.get('/products/low-stock');
    return data;
  },
};
