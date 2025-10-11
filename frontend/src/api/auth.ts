import apiClient from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'VENDEDOR' | 'CONSULTA';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data.data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await apiClient.get('/auth/profile');
    return data.data;
  },

  changePassword: async (passwords: { currentPassword: string; newPassword: string }) => {
    const { data } = await apiClient.post('/auth/change-password', passwords);
    return data;
  },
};
