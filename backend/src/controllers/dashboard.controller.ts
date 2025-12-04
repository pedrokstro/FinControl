import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '@/services/transaction.service';
import { sendSuccess } from '@/utils/response';

const transactionService = new TransactionService();

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { month, year } = req.query;
    
    const data = await transactionService.getDashboardData(
      userId,
      month ? Number(month) : undefined,
      year ? Number(year) : undefined
    );
    
    sendSuccess(res, data, 'Dashboard obtido com sucesso');
  } catch (error) {
    next(error);
  }
};
