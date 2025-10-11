import apiClient from './client';

export interface Sale {
  id: string;
  saleNumber: string;
  customerId?: string;
  customer?: {
    id: string;
    name: string;
  };
  userId: string;
  user: {
    id: string;
    name: string;
  };
  subtotal: number;
  tax: number;
  discount: number;
  extraPercent: number;
  total: number;
  paymentMethod: string;
  status: string;
  observations?: string;
  createdAt: string;
  items: SaleItem[];
}

export interface SaleItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    code: string;
  };
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CreateSaleData {
  customerId?: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  extraPercent: number;
  total: number;
  paymentMethod: string;
  observations?: string;
}

export const saleApi = {
  getAll: async (params?: any) => {
    const { data } = await apiClient.get('/sales', { params });
    return data;
  },

  getById: async (id: string): Promise<Sale> => {
    const { data } = await apiClient.get(`/sales/${id}`);
    return data.data;
  },

  create: async (saleData: CreateSaleData) => {
    const { data } = await apiClient.post('/sales', saleData);
    return data;
  },

  cancel: async (id: string) => {
    const { data } = await apiClient.put(`/sales/${id}/cancel`);
    return data;
  },

  downloadPDF: async (id: string) => {
    const response = await apiClient.get(`/sales/${id}/pdf`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `factura-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
