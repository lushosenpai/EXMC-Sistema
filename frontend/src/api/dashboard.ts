import apiClient from './client';

export const dashboardApi = {
  getStats: async () => {
    const { data } = await apiClient.get('/dashboard/stats');
    return data.data;
  },

  getSalesReport: async (params?: any) => {
    const { data } = await apiClient.get('/dashboard/sales-report', { params });
    return data.data;
  },
};
