import api from '@/config/api';

export interface DailyCashFlow {
  day: number;
  dailyBalance: number;
  cumulativeBalance: number;
}

export interface TopExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface SavingsRate {
  income: number;
  expense: number;
  savings: number;
  savingsRate: number;
  goal: number;
}

export interface ExpenseByWeekday {
  weekday: string;
  weekdayNumber: number;
  total: number;
}

export interface BudgetVsActual {
  category: string;
  categoryKey: string;
  budget: number;
  actual: number;
  difference: number;
  percentage: number;
  status: 'good' | 'warning' | 'over';
}

export interface AnalyticsData {
  dailyCashFlow: DailyCashFlow[];
  topExpenses: TopExpense[];
  savingsRate: SavingsRate;
  expensesByWeekday: ExpenseByWeekday[];
  budgetVsActual: BudgetVsActual[];
  month: number;
  year: number;
}

class AnalyticsService {
  /**
   * Obter todos os dados de analytics
   */
  async getAll(month?: number, year?: number): Promise<AnalyticsData> {
    const params: any = {};
    if (month) params.month = month;
    if (year) params.year = year;

    const response = await api.get('/analytics', { params });
    return response.data.data;
  }

  /**
   * Obter fluxo de caixa diário
   */
  async getDailyCashFlow(month?: number, year?: number): Promise<DailyCashFlow[]> {
    const params: any = {};
    if (month) params.month = month;
    if (year) params.year = year;

    const response = await api.get('/analytics/cash-flow', { params });
    return response.data.data;
  }

  /**
   * Obter top despesas
   */
  async getTopExpenses(month?: number, year?: number, limit = 10): Promise<TopExpense[]> {
    const params: any = { limit };
    if (month) params.month = month;
    if (year) params.year = year;

    const response = await api.get('/analytics/top-expenses', { params });
    return response.data.data;
  }

  /**
   * Obter taxa de poupança
   */
  async getSavingsRate(month?: number, year?: number): Promise<SavingsRate> {
    const params: any = {};
    if (month) params.month = month;
    if (year) params.year = year;

    const response = await api.get('/analytics/savings-rate', { params });
    return response.data.data;
  }

  /**
   * Obter despesas por dia da semana
   */
  async getExpensesByWeekday(month?: number, year?: number): Promise<ExpenseByWeekday[]> {
    const params: any = {};
    if (month) params.month = month;
    if (year) params.year = year;

    const response = await api.get('/analytics/expenses-by-weekday', { params });
    return response.data.data;
  }

  /**
   * Obter orçamento vs real
   */
  async getBudgetVsActual(month?: number, year?: number): Promise<BudgetVsActual[]> {
    const params: any = {};
    if (month) params.month = month;
    if (year) params.year = year;

    const response = await api.get('/analytics/budget-vs-actual', { params });
    return response.data.data;
  }
}

export default new AnalyticsService();
