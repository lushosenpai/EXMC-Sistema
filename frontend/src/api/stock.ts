import apiClient from './client';

export interface StockMovement {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    code: string;
    stock?: number;
  };
  type: 'ENTRADA' | 'SALIDA' | 'AJUSTE' | 'VENTA';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  reference?: string;
  createdAt: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  code: string;
  stock: number;
  minStock: number;
  supplier?: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
  };
}

export const stockApi = {
  getMovements: async (params?: any) => {
    const { data } = await apiClient.get('/stock/movements', { params });
    return data;
  },

  createMovement: async (movementData: {
    productId: string;
    type: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
    quantity: number;
    reason?: string;
    reference?: string;
  }) => {
    const { data } = await apiClient.post('/stock/movements', movementData);
    return data;
  },

  getLowStockProducts: async () => {
    const { data } = await apiClient.get('/stock/low-stock');
    return data;
  },

  getProductHistory: async (productId: string, params?: any) => {
    const { data } = await apiClient.get(`/stock/products/${productId}/history`, { params });
    return data;
  },
};
