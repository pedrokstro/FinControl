import { AppDataSource } from '@/config/database';

/**
 * Serviço de Analytics Avançado
 * Fornece dados para gráficos e análises financeiras
 */
export class AnalyticsService {
  /**
   * 1. Fluxo de Caixa Diário
   * Retorna saldo acumulado dia a dia no mês
   */
  async getDailyCashFlow(userId: string, month: number, year: number) {
    const query = `
      WITH daily_transactions AS (
        SELECT 
          EXTRACT(DAY FROM CAST(date AS DATE)) as day,
          SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as daily_balance
        FROM transactions
        WHERE "userId" = $1
          AND EXTRACT(MONTH FROM CAST(date AS DATE)) = $2
          AND EXTRACT(YEAR FROM CAST(date AS DATE)) = $3
        GROUP BY EXTRACT(DAY FROM CAST(date AS DATE))
        ORDER BY day
      ),
      cumulative AS (
        SELECT 
          day,
          daily_balance,
          SUM(daily_balance) OVER (ORDER BY day) as cumulative_balance
        FROM daily_transactions
      )
      SELECT 
        day::integer,
        daily_balance::numeric,
        cumulative_balance::numeric
      FROM cumulative
      ORDER BY day
    `;

    const result = await AppDataSource.manager.query(query, [userId, month, year]);
    
    return result.map((row: any) => ({
      day: parseInt(row.day),
      dailyBalance: parseFloat(row.daily_balance),
      cumulativeBalance: parseFloat(row.cumulative_balance),
    }));
  }

  /**
   * 2. Top 10 Maiores Despesas
   * Retorna as 10 transações de despesa mais caras do mês
   */
  async getTopExpenses(userId: string, month: number, year: number, limit = 10) {
    const query = `
      SELECT 
        id,
        description,
        amount,
        category,
        date,
        CAST(date AS DATE) as transaction_date
      FROM transactions
      WHERE "userId" = $1
        AND type = 'expense'
        AND EXTRACT(MONTH FROM CAST(date AS DATE)) = $2
        AND EXTRACT(YEAR FROM CAST(date AS DATE)) = $3
      ORDER BY amount DESC
      LIMIT $4
    `;

    const result = await AppDataSource.manager.query(query, [userId, month, year, limit]);
    
    return result.map((row: any) => ({
      id: row.id,
      description: row.description,
      amount: parseFloat(row.amount),
      category: row.category,
      date: row.transaction_date,
    }));
  }

  /**
   * 3. Taxa de Poupança
   * Calcula % da receita que foi economizada
   */
  async getSavingsRate(userId: string, month: number, year: number) {
    const query = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense
      FROM transactions
      WHERE "userId" = $1
        AND EXTRACT(MONTH FROM CAST(date AS DATE)) = $2
        AND EXTRACT(YEAR FROM CAST(date AS DATE)) = $3
    `;

    const result = await AppDataSource.manager.query(query, [userId, month, year]);
    const income = parseFloat(result[0].income);
    const expense = parseFloat(result[0].expense);
    const savings = income - expense;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    return {
      income,
      expense,
      savings,
      savingsRate: Math.max(0, savingsRate), // Não permitir taxa negativa
      goal: 20, // Meta padrão de 20%
    };
  }

  /**
   * 4. Despesas por Dia da Semana
   * Agrupa despesas por dia da semana (0=Domingo, 6=Sábado)
   */
  async getExpensesByWeekday(userId: string, month: number, year: number) {
    const query = `
      SELECT 
        EXTRACT(DOW FROM CAST(date AS DATE)) as weekday,
        COALESCE(SUM(amount), 0) as total
      FROM transactions
      WHERE "userId" = $1
        AND type = 'expense'
        AND EXTRACT(MONTH FROM CAST(date AS DATE)) = $2
        AND EXTRACT(YEAR FROM CAST(date AS DATE)) = $3
      GROUP BY EXTRACT(DOW FROM CAST(date AS DATE))
      ORDER BY weekday
    `;

    const result = await AppDataSource.manager.query(query, [userId, month, year]);
    
    const weekdayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const weekdayData = Array(7).fill(0).map((_, index) => ({
      weekday: weekdayNames[index],
      weekdayNumber: index,
      total: 0,
    }));

    result.forEach((row: any) => {
      const weekdayIndex = parseInt(row.weekday);
      weekdayData[weekdayIndex].total = parseFloat(row.total);
    });

    return weekdayData;
  }

  /**
   * 5. Orçamento vs Real por Categoria
   * Compara gasto planejado com gasto real
   */
  async getBudgetVsActual(userId: string, month: number, year: number) {
    // Buscar orçamentos definidos (assumindo que existe uma tabela de budgets)
    // Por enquanto, vamos usar valores padrão e calcular o real
    
    const query = `
      SELECT 
        category,
        COALESCE(SUM(amount), 0) as actual
      FROM transactions
      WHERE "userId" = $1
        AND type = 'expense'
        AND EXTRACT(MONTH FROM CAST(date AS DATE)) = $2
        AND EXTRACT(YEAR FROM CAST(date AS DATE)) = $3
      GROUP BY category
      ORDER BY actual DESC
    `;

    const result = await AppDataSource.manager.query(query, [userId, month, year]);
    
    // Orçamentos padrão por categoria (pode ser customizado pelo usuário)
    const defaultBudgets: Record<string, number> = {
      food: 800,
      transport: 500,
      entertainment: 300,
      shopping: 400,
      health: 300,
      education: 500,
      bills: 1000,
      others: 500,
    };

    const categoryNames: Record<string, string> = {
      food: 'Alimentação',
      transport: 'Transporte',
      entertainment: 'Entretenimento',
      shopping: 'Compras',
      health: 'Saúde',
      education: 'Educação',
      bills: 'Contas',
      others: 'Outros',
    };

    return result.map((row: any) => {
      const category = row.category;
      const actual = parseFloat(row.actual);
      const budget = defaultBudgets[category] || 500;
      const percentage = budget > 0 ? (actual / budget) * 100 : 0;

      return {
        category: categoryNames[category] || category,
        categoryKey: category,
        budget,
        actual,
        difference: actual - budget,
        percentage: Math.round(percentage),
        status: actual > budget ? 'over' : actual > budget * 0.9 ? 'warning' : 'good',
      };
    });
  }

  /**
   * Obter todos os dados de analytics de uma vez
   */
  async getAllAnalytics(userId: string, month?: number, year?: number) {
    const now = new Date();
    const targetMonth = month || now.getMonth() + 1;
    const targetYear = year || now.getFullYear();

    const [
      dailyCashFlow,
      topExpenses,
      savingsRate,
      expensesByWeekday,
      budgetVsActual,
    ] = await Promise.all([
      this.getDailyCashFlow(userId, targetMonth, targetYear),
      this.getTopExpenses(userId, targetMonth, targetYear),
      this.getSavingsRate(userId, targetMonth, targetYear),
      this.getExpensesByWeekday(userId, targetMonth, targetYear),
      this.getBudgetVsActual(userId, targetMonth, targetYear),
    ]);

    return {
      dailyCashFlow,
      topExpenses,
      savingsRate,
      expensesByWeekday,
      budgetVsActual,
      month: targetMonth,
      year: targetYear,
    };
  }
}

export default new AnalyticsService();
