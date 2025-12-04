import { Request, Response, NextFunction } from 'express';
import savingsGoalService from '../services/savingsGoal.service';
import { sendSuccess } from '../utils/response';

export class SavingsGoalController {
  /**
   * Criar ou atualizar meta de economia
   */
  async upsertGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { targetAmount, month, year, description } = req.body;

      await savingsGoalService.upsertGoal(userId, {
        targetAmount,
        month,
        year,
        description,
      });

      // Atualizar valor atual baseado nas transações
      await savingsGoalService.updateCurrentAmount(userId, month, year);

      // Buscar meta atualizada
      const updatedGoal = await savingsGoalService.getGoalByMonthYear(userId, month, year);

      return sendSuccess(res, updatedGoal, 'Meta criada/atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Buscar meta atual (mês/ano atual)
   */
  async getCurrentGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      const goal = await savingsGoalService.getCurrentGoal(userId);

      if (goal) {
        // Atualizar valor atual antes de retornar
        await savingsGoalService.updateCurrentAmount(userId, goal.month, goal.year);
        const updatedGoal = await savingsGoalService.getGoalByMonthYear(userId, goal.month, goal.year);
        return sendSuccess(res, updatedGoal);
      } else {
        return res.status(404).json({ message: 'Nenhuma meta definida para o mês atual' });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Buscar meta por mês/ano específico
   */
  async getGoalByMonthYear(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { month, year } = req.params;

      const goal = await savingsGoalService.getGoalByMonthYear(userId, parseInt(month), parseInt(year));

      if (goal) {
        // Atualizar valor atual antes de retornar
        await savingsGoalService.updateCurrentAmount(userId, parseInt(month), parseInt(year));
        const updatedGoal = await savingsGoalService.getGoalByMonthYear(userId, parseInt(month), parseInt(year));
        return sendSuccess(res, updatedGoal);
      } else {
        return res.status(404).json({ message: 'Meta não encontrada' });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Buscar todas as metas do usuário
   */
  async getAllGoals(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      const goals = await savingsGoalService.getAllGoals(userId);

      return sendSuccess(res, goals);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletar meta
   */
  async deleteGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { goalId } = req.params;

      const deleted = await savingsGoalService.deleteGoal(userId, goalId);

      if (deleted) {
        return sendSuccess(res, null, 'Meta deletada com sucesso');
      } else {
        return res.status(404).json({ message: 'Meta não encontrada' });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new SavingsGoalController();
