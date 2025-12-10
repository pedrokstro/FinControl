import { AppDataSource } from '../config/database';
import { SavingsGoal, CreateSavingsGoalData } from '../models/SavingsGoal';

export class SavingsGoalService {
  /**
   * Criar ou atualizar meta de economia para um mês/ano específico
   */
  async upsertGoal(userId: string, data: CreateSavingsGoalData): Promise<SavingsGoal> {
    const { targetAmount, month, year, description } = data;

    const query = `
      INSERT INTO savings_goals ("userId", "targetAmount", "month", "year", "description")
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT ("userId", "month", "year") DO UPDATE SET
        "targetAmount" = EXCLUDED."targetAmount",
        "description" = EXCLUDED."description",
        "updatedAt" = CURRENT_TIMESTAMP
    `;

    await AppDataSource.manager.query(query, [userId, targetAmount, month, year, description || null]);
    return this.getGoalByMonthYear(userId, month, year) as Promise<SavingsGoal>;
  }

  /**
   * Buscar meta de economia para um mês/ano específico
   */
  async getGoalByMonthYear(userId: string, month: number, year: number): Promise<SavingsGoal | null> {
    const query = `
      SELECT * FROM savings_goals
      WHERE "userId" = $1 AND "month" = $2 AND "year" = $3
    `;

    const result = await AppDataSource.manager.query(query, [userId, month, year]);
    
    if (result.length === 0) {
      return null;
    }

    return this.mapToSavingsGoal(result[0]);
  }

  /**
   * Buscar meta atual (mês/ano atual)
   */
  async getCurrentGoal(userId: string): Promise<SavingsGoal | null> {
    const now = new Date();
    const month = now.getMonth() + 1; // JavaScript months are 0-indexed
    const year = now.getFullYear();

    return this.getGoalByMonthYear(userId, month, year);
  }

  /**
   * Atualizar valor atual da meta baseado nas transações do mês
   */
  async updateCurrentAmount(userId: string, month: number, year: number): Promise<void> {
    // Calcular saldo do mês (receitas - despesas)
    // Usar CAST para converter date (VARCHAR) para DATE
    const transactionsQuery = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense
      FROM transactions
      WHERE "userId" = $1
        AND EXTRACT(MONTH FROM CAST(date AS DATE)) = $2
        AND EXTRACT(YEAR FROM CAST(date AS DATE)) = $3
    `;

    const transactionsResult = await AppDataSource.manager.query(transactionsQuery, [userId, month, year]);
    const { income, expense } = transactionsResult[0];
    const currentAmount = Math.max(0, parseFloat(income) - parseFloat(expense));

    // Atualizar current_amount na meta
    const updateQuery = `
      UPDATE savings_goals
      SET "currentAmount" = $1, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "userId" = $2 AND "month" = $3 AND "year" = $4
    `;

    await AppDataSource.manager.query(updateQuery, [currentAmount, userId, month, year]);
  }

  /**
   * Buscar todas as metas do usuário
   */
  async getAllGoals(userId: string): Promise<SavingsGoal[]> {
    const query = `
      SELECT * FROM savings_goals
      WHERE "userId" = $1
      ORDER BY "year" DESC, "month" DESC
    `;

    const result = await AppDataSource.manager.query(query, [userId]);
    return result.map((row: any) => this.mapToSavingsGoal(row));
  }

  /**
   * Deletar meta
   */
  async deleteGoal(userId: string, goalId: string): Promise<boolean> {
    const query = `
      DELETE FROM savings_goals
      WHERE id = $1 AND "userId" = $2
    `;

    await AppDataSource.manager.query(query, [goalId, userId]);
    return true;
  }

  /**
   * Mapear resultado do banco para o modelo
   */
  private mapToSavingsGoal(row: any): SavingsGoal {
    return {
      id: row.id,
      userId: row.userId || row.userid, // Supabase pode retornar em lowercase
      targetAmount: parseFloat(row.targetAmount || row.targetamount || 0),
      currentAmount: parseFloat(row.currentAmount || row.currentamount || 0),
      month: parseInt(row.month),
      year: parseInt(row.year),
      description: row.description,
      createdAt: row.createdAt || row.createdat,
      updatedAt: row.updatedAt || row.updatedat,
    };
  }
}

export default new SavingsGoalService();
