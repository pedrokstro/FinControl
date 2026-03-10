import api from '@/config/api';
import { CreditCard } from '@/types';

class CreditCardService {
  async getAll(): Promise<CreditCard[]> {
    const response = await api.get('/credit-cards');
    return response.data.data;
  }

  async getById(id: string): Promise<CreditCard> {
    const response = await api.get(`/credit-cards/${id}`);
    return response.data.data;
  }

  async create(data: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<CreditCard> {
    const response = await api.post('/credit-cards', data);
    return response.data.data;
  }

  async update(id: string, data: Partial<CreditCard>): Promise<CreditCard> {
    const response = await api.put(`/credit-cards/${id}`, data);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/credit-cards/${id}`);
  }
}

export default new CreditCardService();
