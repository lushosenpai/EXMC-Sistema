import apiClient from './client';

export interface CustomerPayment {
  id: string;
  customerId: string;
  amount: number;
  paymentMethod: string;
  reference?: string;
  description?: string;
  createdAt: string;
  createdBy?: string;
}

export interface AccountSummary {
  customer: {
    id: string;
    name: string;
    accountType: string;
    creditLimit: number;
    currentBalance: number;
  };
  summary: {
    totalSales: number;
    totalPayments: number;
    currentBalance: number;
    availableCredit: number;
    creditUtilization: number;
  };
  recentSales: any[];
  recentPayments: CustomerPayment[];
}

export const customerPaymentApi = {
  getPayments: async (customerId: string, params?: any) => {
    const { data } = await apiClient.get(`/customers/${customerId}/payments`, { params });
    return data;
  },

  createPayment: async (customerId: string, paymentData: {
    amount: number;
    paymentMethod: string;
    reference?: string;
    description?: string;
  }) => {
    const { data } = await apiClient.post(`/customers/${customerId}/payments`, paymentData);
    return data;
  },

  deletePayment: async (customerId: string, paymentId: string) => {
    const { data } = await apiClient.delete(`/customers/${customerId}/payments/${paymentId}`);
    return data;
  },

  getAccountSummary: async (customerId: string): Promise<{ data: AccountSummary }> => {
    const { data } = await apiClient.get(`/customers/${customerId}/account-summary`);
    return data;
  },
};
