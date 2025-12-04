import api from '@/config/api';

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

class CategoryService {
  async getAll(type?: 'income' | 'expense'): Promise<Category[]> {
    const params = type ? { type } : {};
    const response = await api.get('/categories', { params });
    return response.data.data;
  }

  async getById(id: string): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
    return response.data.data;
  }

  async create(data: CreateCategoryData): Promise<Category> {
    const response = await api.post('/categories', data);
    return response.data.data;
  }

  async update(id: string, data: Partial<CreateCategoryData>): Promise<Category> {
    const response = await api.put(`/categories/${id}`, data);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  }
}

export default new CategoryService();
