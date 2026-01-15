import { Request, Response, NextFunction } from 'express';
import { subscriptionService } from '../services/subscription.service';

/**
 * Middleware para verificar limite de transações mensais
 * Plano Free: 10 transações/mês
 * Plano Premium: Ilimitado
 */
export const checkTransactionLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado',
      });
    }

    // Verificar se pode criar transação
    const check = await subscriptionService.canCreateTransaction(userId);

    if (!check.allowed) {
      return res.status(403).json({
        success: false,
        message: check.message,
        data: {
          currentCount: check.currentCount,
          limit: check.limit,
          upgradeRequired: true,
        },
      });
    }

    // Adicionar informações de uso ao request para uso posterior
    req.transactionUsage = {
      currentCount: check.currentCount,
      limit: check.limit,
    };

    next();
  } catch (error) {
    console.error('Erro ao verificar limite de transações:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao verificar limite de transações',
    });
  }
};
