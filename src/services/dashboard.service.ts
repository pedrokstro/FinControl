import api from '@/config/api';

export interface DashboardSummary {
  income: number;
  expense: number;
  balance: number;
  month: number;
  year: number;
}

export interface CategorySummary {
  name: string;
  type: 'income' | 'expense';
  total: number;
  color: string;
  icon: string;
}

export interface DashboardData {
  summary: DashboardSummary;
  recentTransactions: any[];
  byCategory: CategorySummary[];
}

class DashboardService {
  async getData(month?: number, year?: number): Promise<DashboardData> {
    const params: any = {};
    if (month) params.month = month;
    if (year) params.year = year;

    const response = await api.get('/dashboard', { params });
    return response.data.data;
  }
}

export default new DashboardService();
