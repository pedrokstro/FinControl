import api from '@/config/api';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  userId: string;
  category: {
    id: string;
    name: string;
    type: string;
    color: string;
    icon: string;
  };
  createdAt: string;
  updatedAt: string;
  isRecurring?: boolean;
  recurrenceType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurrenceEndDate?: string;
  nextOccurrence?: string;
  parentTransactionId?: string;
}

export interface CreateTransactionData {
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  isRecurring?: boolean;
  recurrenceType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurrenceEndDate?: string;
  recurrenceMonths?: number;
}

export interface TransactionFilters {
  month?: number;
  year?: number;
  type?: 'income' | 'expense';
  categoryId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class TransactionService {
  async getAll(filters?: TransactionFilters): Promise<TransactionListResponse> {
    const response = await api.get('/transactions', { params: filters });
    // A API retorna { data: [...], meta: {...} }
    // Precisamos transformar para o formato esperado
    return {
      transactions: response.data.data, // Array de transações
      total: response.data.meta.total,
      page: response.data.meta.page,
      limit: response.data.meta.limit,
      totalPages: response.data.meta.totalPages,
    };
  }

  async getById(id: string): Promise<Transaction> {
    const response = await api.get(`/transactions/${id}`);
    return response.data.data;
  }

  async create(data: CreateTransactionData): Promise<Transaction | Transaction[]> {
    // Garantir que a data seja sempre string no formato YYYY-MM-DD
    const dataToSend = {
      ...data,
      date: typeof data.date === 'string' ? data.date : data.date,
      recurrenceEndDate: data.recurrenceEndDate && typeof data.recurrenceEndDate === 'string' 
        ? data.recurrenceEndDate 
        : data.recurrenceEndDate,
      recurrenceMonths: data.recurrenceMonths,
    };
    
    console.log('📤 [FRONTEND] Enviando para API:', dataToSend);
    console.log('📤 [FRONTEND] Tipo da data:', typeof dataToSend.date);
    console.log('📤 [FRONTEND] JSON.stringify:', JSON.stringify(dataToSend));
    
    // Usar fetch ao invés de axios para ter controle total
    const authStorage = localStorage.getItem('auth-storage');
    let token = '';
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      token = state?.accessToken || '';
    }
    
    const response = await fetch(`${api.defaults.baseURL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dataToSend)
    });
    
    const result = await response.json();
    return result.data;
  }

  async update(id: string, data: Partial<CreateTransactionData>): Promise<Transaction> {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
  }
}

export default new TransactionService();
