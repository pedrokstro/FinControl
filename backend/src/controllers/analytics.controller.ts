import { Request, Response, NextFunction } from 'express';
import analyticsService from '@/services/analytics.service';
import { sendSuccess } from '@/utils/response';

export class AnalyticsController {
  /**
   * Obter todos os dados de analytics
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { month, year } = req.query;

      const data = await analyticsService.getAllAnalytics(
        userId,
        month ? parseInt(month as string) : undefined,
        year ? parseInt(year as string) : undefined
      );

      sendSuccess(res, data, 'Analytics obtidos com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obter fluxo de caixa diário
   */
  async getDailyCashFlow(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { month, year } = req.query;
      
      const now = new Date();
      const targetMonth = month ? parseInt(month as string) : now.getMonth() + 1;
      const targetYear = year ? parseInt(year as string) : now.getFullYear();

      const data = await analyticsService.getDailyCashFlow(userId, targetMonth, targetYear);

      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obter top despesas
   */
  async getTopExpenses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { month, year, limit } = req.query;
      
      const now = new Date();
      const targetMonth = month ? parseInt(month as string) : now.getMonth() + 1;
      const targetYear = year ? parseInt(year as string) : now.getFullYear();
      const targetLimit = limit ? parseInt(limit as string) : 10;

      const data = await analyticsService.getTopExpenses(userId, targetMonth, targetYear, targetLimit);

      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obter taxa de poupança
   */
  async getSavingsRate(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { month, year } = req.query;
      
      const now = new Date();
      const targetMonth = month ? parseInt(month as string) : now.getMonth() + 1;
      const targetYear = year ? parseInt(year as string) : now.getFullYear();

      const data = await analyticsService.getSavingsRate(userId, targetMonth, targetYear);

      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obter despesas por dia da semana
   */
  async getExpensesByWeekday(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { month, year } = req.query;
      
      const now = new Date();
      const targetMonth = month ? parseInt(month as string) : now.getMonth() + 1;
      const targetYear = year ? parseInt(year as string) : now.getFullYear();

      const data = await analyticsService.getExpensesByWeekday(userId, targetMonth, targetYear);

      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obter orçamento vs real
   */
  async getBudgetVsActual(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { month, year } = req.query;
      
      const now = new Date();
      const targetMonth = month ? parseInt(month as string) : now.getMonth() + 1;
      const targetYear = year ? parseInt(year as string) : now.getFullYear();

      const data = await analyticsService.getBudgetVsActual(userId, targetMonth, targetYear);

      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }
}

export default new AnalyticsController();
