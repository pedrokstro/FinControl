import axios from 'axios';

// URL base da API
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Instância do axios configurada
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  transformRequest: [
    (data) => {
      // Garantir que datas sejam sempre strings, não Date objects
      if (data && typeof data === 'object') {
        const transformed = { ...data };
        // Percorrer todas as propriedades
        Object.keys(transformed).forEach(key => {
          const value = transformed[key];
          // Se for um Date object, converter para string YYYY-MM-DD
          if (value instanceof Date) {
            const year = value.getFullYear();
            const month = String(value.getMonth() + 1).padStart(2, '0');
            const day = String(value.getDate()).padStart(2, '0');
            transformed[key] = `${year}-${month}-${day}`;
          }
        });
        return JSON.stringify(transformed);
      }
      return JSON.stringify(data);
    }
  ],
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    // Buscar token do Zustand storage
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
        // Buscar refreshToken do Zustand storage
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const { state } = JSON.parse(authStorage);
          const refreshToken = state?.refreshToken;
          
          if (refreshToken) {
            // Tentar renovar o token
            const response = await axios.post(`${API_URL}/auth/refresh`, {
              refreshToken,
            });

            const { accessToken } = response.data.data;
            
            // Atualizar token no Zustand storage
            const updatedState = {
              ...state,
              accessToken,
            };
            localStorage.setItem('auth-storage', JSON.stringify({ state: updatedState }));

            // Refazer a requisição original com o novo token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Se falhar ao renovar, limpar storage e redirecionar para login
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
