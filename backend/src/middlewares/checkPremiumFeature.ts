import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '@/config/database';
import { User } from '@/models/User';

/**
 * Middleware genérico para verificar se o usuário tem acesso a uma feature premium
 * @param featureName - Nome da feature a ser verificada (ex: 'export_reports', 'export_data', 'calculators')
 */
export const checkPremiumFeature = (featureName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
        });
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado',
        });
      }

      // Verificar se o usuário tem acesso à feature
      if (!user.hasFeatureAccess(featureName)) {
        return res.status(403).json({
          success: false,
          message: `Acesso negado. Esta funcionalidade (${featureName}) é exclusiva do plano Premium.`,
          data: {
            feature: featureName,
            isPremium: user.isPlanActive(),
            upgradeRequired: true,
          },
        });
      }

      next();
    } catch (error) {
      console.error('Erro ao verificar feature premium:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao verificar permissões',
      });
    }
  };
};

/**
 * Middleware específico para exportação de relatórios
 */
export const checkExportReports = checkPremiumFeature('export_reports');

/**
 * Middleware específico para exportação de dados
 */
export const checkExportData = checkPremiumFeature('export_data');

/**
 * Middleware específico para calculadoras
 */
export const checkCalculators = checkPremiumFeature('calculators');
