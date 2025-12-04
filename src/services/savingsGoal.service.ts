import api from '@/config/api';

export interface SavingsGoal {
  id: string;
  userId: string;
  targetAmount: number;
  currentAmount: number;
  month: number;
  year: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavingsGoalData {
  targetAmount: number;
  month: number;
  year: number;
  description?: string;
}

class SavingsGoalService {
  /**
   * Criar ou atualizar meta de economia
   */
  async upsertGoal(data: CreateSavingsGoalData): Promise<SavingsGoal> {
    const response = await api.post('/savings-goals', data);
    return response.data.data;
  }

  /**
   * Buscar meta do mês atual
   */
  async getCurrentGoal(): Promise<SavingsGoal | null> {
    try {
      const response = await api.get('/savings-goals/current');
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Buscar meta por mês/ano
   */
  async getGoalByMonthYear(month: number, year: number): Promise<SavingsGoal | null> {
    try {
      const response = await api.get(`/savings-goals/${month}/${year}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Buscar todas as metas
   */
  async getAllGoals(): Promise<SavingsGoal[]> {
    const response = await api.get('/savings-goals');
    return response.data.data;
  }

  /**
   * Deletar meta
   */
  async deleteGoal(goalId: string): Promise<void> {
    await api.delete(`/savings-goals/${goalId}`);
  }
}

export default new SavingsGoalService();
