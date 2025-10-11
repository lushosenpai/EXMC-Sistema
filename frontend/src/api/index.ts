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

export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  supplierId: string;
  supplier?: {
    id: string;
    name: string;
  };
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  cuitDni?: string;
  accountType: 'EFECTIVO' | 'CUENTA_CORRIENTE';
  creditLimit: number;
  currentBalance: number;
  observations?: string;
  isActive: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  province?: string;
  observations?: string;
  isActive: boolean;
}

export const productApi = {
  getAll: async (params?: any) => {
    const { data } = await apiClient.get('/products', { params });
    return data;
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get(`/products/${id}`);
    return data.data;
  },

  create: async (product: Partial<Product>) => {
    const { data } = await apiClient.post('/products', product);
    return data;
  },

  update: async (id: string, product: Partial<Product>) => {
    const { data } = await apiClient.put(`/products/${id}`, product);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete(`/products/${id}`);
    return data;
  },
};

export const customerApi = {
  getAll: async (params?: any) => {
    const { data } = await apiClient.get('/customers', { params });
    return data;
  },

  getById: async (id: string): Promise<Customer> => {
    const { data } = await apiClient.get(`/customers/${id}`);
    return data.data;
  },

  create: async (customer: Partial<Customer>) => {
    const { data } = await apiClient.post('/customers', customer);
    return data;
  },

  update: async (id: string, customer: Partial<Customer>) => {
    const { data} = await apiClient.put(`/customers/${id}`, customer);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete(`/customers/${id}`);
    return data;
  },
};

export const supplierApi = {
  getAll: async (params?: any) => {
    const { data } = await apiClient.get('/suppliers', { params });
    return data;
  },

  getById: async (id: string): Promise<Supplier> => {
    const { data } = await apiClient.get(`/suppliers/${id}`);
    return data.data;
  },

  create: async (supplier: Partial<Supplier>) => {
    const { data } = await apiClient.post('/suppliers', supplier);
    return data;
  },

  update: async (id: string, supplier: Partial<Supplier>) => {
    const { data } = await apiClient.put(`/suppliers/${id}`, supplier);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete(`/suppliers/${id}`);
    return data;
  },
};

export const userApi = {
  getAll: async (params?: any) => {
    const { data } = await apiClient.get('/users', { params });
    return data;
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get(`/users/${id}`);
    return data.data;
  },

  create: async (user: {
    email: string;
    password: string;
    name: string;
    role?: 'ADMIN' | 'VENDEDOR' | 'CONSULTA';
  }) => {
    const { data } = await apiClient.post('/users', user);
    return data;
  },

  update: async (
    id: string,
    user: {
      email?: string;
      name?: string;
      role?: 'ADMIN' | 'VENDEDOR' | 'CONSULTA';
      isActive?: boolean;
    }
  ) => {
    const { data } = await apiClient.put(`/users/${id}`, user);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete(`/users/${id}`);
    return data;
  },

  resetPassword: async (id: string, newPassword: string) => {
    const { data } = await apiClient.post(`/users/${id}/reset-password`, {
      newPassword,
    });
    return data;
  },
};
