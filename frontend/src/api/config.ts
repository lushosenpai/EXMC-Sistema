import apiClient from './client';

export interface SystemConfig {
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyCuit?: string;
  taxRate?: string;
  currency?: string;
  currencySymbol?: string;
  terms?: string;
  receiptFooter?: string;
  logoUrl?: string;
}

export const configApi = {
  getAll: async (): Promise<{ data: SystemConfig }> => {
    const { data } = await apiClient.get('/config');
    return data;
  },

  update: async (key: string, value: string) => {
    const { data } = await apiClient.put('/config', { key, value });
    return data;
  },

  updateMultiple: async (configs: Record<string, string>) => {
    const promises = Object.entries(configs).map(([key, value]) =>
      apiClient.put('/config', { key, value })
    );
    await Promise.all(promises);
    return { success: true };
  },
};
