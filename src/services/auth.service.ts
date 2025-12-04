import api from '@/config/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    // Tokens são gerenciados pelo Zustand authStore
    return response.data.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    // Tokens são gerenciados pelo Zustand authStore
    return response.data.data;
  }

  async logout(): Promise<void> {
    // O refreshToken é obtido do Zustand authStore
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
    // Limpeza é feita pelo Zustand authStore
  }

  async refreshToken(refreshToken: string): Promise<string> {
    const response = await api.post('/auth/refresh', { refreshToken });
    const { accessToken } = response.data.data;
    return accessToken;
  }

  async verifyEmail(email: string, code: string): Promise<void> {
    await api.post('/auth/verify-email', { email, code });
  }

  async resendVerificationCode(email: string): Promise<void> {
    await api.post('/auth/resend-verification', { email });
  }

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    await api.post('/auth/reset-password', { email, code, newPassword });
  }

  // Métodos removidos - usar Zustand authStore ao invés de localStorage
  // getCurrentUser() - usar useAuthStore((state) => state.user)
  // isAuthenticated() - usar useAuthStore((state) => state.isAuthenticated)
}

export default new AuthService();
