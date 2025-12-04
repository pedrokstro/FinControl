import api from '@/config/api';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

class UserService {
  async getProfile(): Promise<User> {
    const response = await api.get('/users/me');
    return response.data.data;
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.put('/users/me', data);
    // Usuário é atualizado no Zustand authStore automaticamente
    return response.data.data;
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    await api.put('/users/me/password', data);
  }

  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Usuário é atualizado no Zustand authStore automaticamente
    return response.data.data;
  }

  async requestEmailChange(newEmail: string): Promise<void> {
    await api.post('/users/me/email/request-change', { newEmail });
  }

  async confirmEmailChange(newEmail: string, code: string): Promise<User> {
    const response = await api.post('/users/me/email/confirm-change', { newEmail, code });
    return response.data.data;
  }

  async requestPasswordChange(): Promise<void> {
    await api.post('/users/me/password/request-change');
  }

  async confirmPasswordChange(
    currentPassword: string,
    newPassword: string,
    code: string
  ): Promise<void> {
    await api.post('/users/me/password/confirm-change', {
      currentPassword,
      newPassword,
      code
    });
  }
}

export default new UserService();
