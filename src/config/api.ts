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

// Callbacks leves para sincronizar estado em memória sem criar dependência circular com stores
let onTokenRefreshedHandler: ((accessToken: string) => void) | null = null;
let onAuthExpiredHandler: (() => void) | null = null;

export const registerApiAuthHandlers = (handlers: {
  onTokenRefreshed?: (accessToken: string) => void;
  onAuthExpired?: () => void;
}) => {
  onTokenRefreshedHandler = handlers.onTokenRefreshed ?? null;
  onAuthExpiredHandler = handlers.onAuthExpired ?? null;
};

let inFlightRefresh: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  if (inFlightRefresh) {
    return inFlightRefresh;
  }

  inFlightRefresh = (async () => {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return null;

    const parsed = JSON.parse(authStorage);
    const refreshToken = parsed?.state?.refreshToken;
    if (!refreshToken) return null;

    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken,
    });

    const accessToken: string | undefined = response.data?.data?.accessToken;
    if (!accessToken) return null;

    localStorage.setItem(
      'auth-storage',
      JSON.stringify({
        ...parsed,
        state: {
          ...parsed.state,
          accessToken,
        },
      })
    );

    onTokenRefreshedHandler?.(accessToken);
    return accessToken;
  })();

  try {
    return await inFlightRefresh;
  } finally {
    inFlightRefresh = null;
  }
};

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 e não for uma tentativa de refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const accessToken = await refreshAccessToken();
        if (accessToken) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('auth-storage');
        onAuthExpiredHandler?.();
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
