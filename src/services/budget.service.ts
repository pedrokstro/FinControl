import { Budget } from '../types'
import api from './api'

export const budgetService = {
    getBudgets: async (): Promise<Budget[]> => {
        const response = await api.get('/budgets');
        return response.data.data;
    },

    saveBudget: async (data: Omit<Budget, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<Budget> => {
        const response = await api.post('/budgets', data);
        return response.data.data;
    },

    deleteBudget: async (categoryId: string): Promise<void> => {
        await api.delete(`/budgets/${categoryId}`);
    }
}
