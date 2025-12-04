import api from '@/config/api';

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  categoriesViewMode?: 'grid' | 'list';
  [key: string]: string | undefined;
}

class UserPreferenceService {
  /**
   * Obter todas as preferências do usuário
   */
  async getAll(): Promise<UserPreferences> {
    const response = await api.get('/user-preferences');
    return response.data.data;
  }

  /**
   * Obter uma preferência específica
   */
  async get(key: string): Promise<string | null> {
    try {
      const response = await api.get(`/user-preferences/${key}`);
      return response.data.data.value;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Definir uma preferência específica
   */
  async set(key: string, value: string): Promise<void> {
    await api.put(`/user-preferences/${key}`, { value });
  }

  /**
   * Definir múltiplas preferências
   */
  async setMany(preferences: Record<string, string>): Promise<void> {
    await api.post('/user-preferences', preferences);
  }

  /**
   * Excluir uma preferência específica
   */
  async delete(key: string): Promise<void> {
    await api.delete(`/user-preferences/${key}`);
  }
}

export default new UserPreferenceService();
