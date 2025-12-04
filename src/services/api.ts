import axios from 'axios';

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Criar instância do axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        const token = state?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Erro ao parsear auth storage:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const { state } = JSON.parse(authStorage);
          const refreshToken = state?.refreshToken;

          if (refreshToken) {
            // Tentar renovar o token
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            });

            const { accessToken } = response.data.data;

            // Atualizar token no storage
            const updatedStorage = {
              ...JSON.parse(authStorage),
              state: {
                ...state,
                accessToken,
              },
            };
            localStorage.setItem('auth-storage', JSON.stringify(updatedStorage));

            // Retentar requisição original
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Se falhar ao renovar, fazer logout
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Tipos
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: string;
  isActive: boolean;
  isPremium?: boolean;
  planType?: 'free' | 'premium';
  planEndDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Serviços de Autenticação
export const authService = {
  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  },

  async login(data: LoginData): Promise<LoginResponse> {
    const response = await api.post('/auth/login', data);
    return response.data.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post('/auth/logout', { refreshToken });
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data.data;
  },
};

// Serviços de Usuário
export const userService = {
  async getProfile(): Promise<User> {
    const response = await api.get('/users/me');
    return response.data.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.put('/users/me', data);
    return response.data.data;
  },

  async changePassword(data: ChangePasswordData): Promise<void> {
    await api.put('/users/me/password', data);
  },

  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};

// Serviços de Categorias
export const categoryService = {
  async getAll() {
    const response = await api.get('/categories');
    return response.data.data;
  },

  async create(data: any) {
    const response = await api.post('/categories', data);
    return response.data.data;
  },

  async update(id: string, data: any) {
    const response = await api.put(`/categories/${id}`, data);
    return response.data.data;
  },

  async delete(id: string) {
    await api.delete(`/categories/${id}`);
  },
};

// Serviços de Transações
export const transactionService = {
  async getAll() {
    const response = await api.get('/transactions');
    return response.data.data;
  },

  async create(data: any) {
    const response = await api.post('/transactions', data);
    return response.data.data;
  },

  async update(id: string, data: any) {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data.data;
  },

  async delete(id: string) {
    await api.delete(`/transactions/${id}`);
  },
};

export default api;
