import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  userId?: string;
  premiumUser?: User;
}

/**
 * Middleware para verificar se o usuário tem acesso premium ativo
 */
export const checkPremiumAccess = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Usuário não autenticado',
      });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
      return;
    }

    // Verificar se o plano está ativo
    if (!user.isPlanActive()) {
      res.status(403).json({
        success: false,
        message: 'Acesso negado. Esta funcionalidade requer um plano Premium ativo.',
        code: 'PREMIUM_REQUIRED',
        planType: user.planType,
        planEndDate: user.planEndDate,
      });
      return;
    }

    // Adicionar usuário ao request para uso posterior
    req.premiumUser = user;
    next();
  } catch (error) {
    console.error('Erro ao verificar acesso premium:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar acesso premium',
    });
  }
};

/**
 * Middleware para verificar acesso a uma feature específica
 */
export const checkFeatureAccess = (feature: string) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
        });
        return;
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado',
        });
        return;
      }

      // Verificar se tem acesso à feature
      if (!user.hasFeatureAccess(feature)) {
        res.status(403).json({
          success: false,
          message: `Acesso negado. A funcionalidade "${feature}" requer um plano Premium ativo.`,
          code: 'FEATURE_PREMIUM_REQUIRED',
          feature,
          planType: user.planType,
          planEndDate: user.planEndDate,
        });
        return;
      }

      req.premiumUser = user;
      next();
    } catch (error) {
      console.error('Erro ao verificar acesso à feature:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao verificar acesso à feature',
      });
    }
  };
};
