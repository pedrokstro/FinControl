import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '@/services/transaction.service';
import { sendSuccess } from '@/utils/response';
import { AppDataSource } from '@/config/database';

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

export const getDashboardCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await AppDataSource.query(
      'SELECT id, title, desc_text as "desc", icon, image_src as "imageSrc", bg, text_color as "textColor", desc_color as "descColor", icon_color as "iconColor", icon_bg as "iconBg", action_path as "actionPath" FROM public.dashboard_cards WHERE is_active = true ORDER BY created_at DESC'
    );
    sendSuccess(res, cards, 'Cards do dashboard obtidos com sucesso');
  } catch (error) {
    next(error);
  }
};
