import { Request, Response } from 'express';
import { subscriptionService } from '../services/subscription.service';

export class SubscriptionController {
  /**
   * GET /api/subscription/status
   * Obter status da assinatura do usuário
   */
  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
        });
        return;
      }

      const status = await subscriptionService.getSubscriptionStatus(userId);

      res.json({
        success: true,
        data: status,
      });
    } catch (error: any) {
      console.error('Erro ao obter status da assinatura:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao obter status da assinatura',
      });
    }
  }

  /**
   * POST /api/subscription/activate
   * Ativar plano premium
   */
  async activate(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { durationMonths = 1 } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
        });
        return;
      }

      const user = await subscriptionService.activatePremiumPlan(
        userId,
        durationMonths
      );

      res.json({
        success: true,
        message: 'Plano Premium ativado com sucesso!',
        data: {
          planType: user.planType,
          planStartDate: user.planStartDate,
          planEndDate: user.planEndDate,
          isPremium: user.isPremium,
        },
      });
    } catch (error: any) {
      console.error('Erro ao ativar plano premium:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao ativar plano premium',
      });
    }
  }

  /**
   * POST /api/subscription/cancel
   * Cancelar plano premium
   */
  async cancel(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
        });
        return;
      }

      const user = await subscriptionService.cancelPremiumPlan(userId);

      res.json({
        success: true,
        message: 'Plano Premium cancelado com sucesso',
        data: {
          planType: user.planType,
          isPremium: user.isPremium,
        },
      });
    } catch (error: any) {
      console.error('Erro ao cancelar plano premium:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao cancelar plano premium',
      });
    }
  }

  /**
   * POST /api/subscription/renew
   * Renovar plano premium
   */
  async renew(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { durationMonths = 1 } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
        });
        return;
      }

      const user = await subscriptionService.renewPremiumPlan(
        userId,
        durationMonths
      );

      res.json({
        success: true,
        message: 'Plano Premium renovado com sucesso!',
        data: {
          planType: user.planType,
          planStartDate: user.planStartDate,
          planEndDate: user.planEndDate,
          isPremium: user.isPremium,
        },
      });
    } catch (error: any) {
      console.error('Erro ao renovar plano premium:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao renovar plano premium',
      });
    }
  }

  /**
   * GET /api/subscription/features
   * Obter features disponíveis
   */
  async getFeatures(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
        });
        return;
      }

      const status = await subscriptionService.getSubscriptionStatus(userId);

      res.json({
        success: true,
        data: {
          features: status.features,
          isPremium: status.isPremium,
        },
      });
    } catch (error: any) {
      console.error('Erro ao obter features:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao obter features',
      });
    }
  }

  /**
   * POST /api/subscription/google-pay
   * Processar pagamento via Google Pay
   */
  async processGooglePay(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { paymentData } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
        });
        return;
      }

      if (!paymentData) {
        res.status(400).json({
          success: false,
          message: 'Dados de pagamento não fornecidos',
        });
        return;
      }

      const result = await subscriptionService.processGooglePaySubscription(
        userId,
        paymentData
      );

      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.error || 'Erro ao processar pagamento',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Assinatura Premium ativada com sucesso via Google Pay!',
        data: {
          planType: result.user?.planType,
          planStartDate: result.user?.planStartDate,
          planEndDate: result.user?.planEndDate,
          isPremium: result.user?.isPremium,
          subscriptionStatus: result.user?.subscriptionStatus,
        },
      });
    } catch (error: any) {
      console.error('Erro ao processar Google Pay:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao processar pagamento',
      });
    }
  }

  /**
   * POST /api/subscription/start-trial
   * Iniciar período de teste grátis de 7 dias
   */
  async startTrial(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
        });
        return;
      }

      const result = await subscriptionService.startTrial(userId);

      res.json({
        success: true,
        message: 'Teste grátis de 7 dias ativado com sucesso!',
        data: {
          planType: result.planType,
          planStartDate: result.planStartDate,
          planEndDate: result.planEndDate,
          isPremium: result.isPremium,
          isTrial: result.isTrial,
        },
      });
    } catch (error: any) {
      console.error('Erro ao iniciar trial:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao iniciar período de teste',
      });
    }
  }

  /**
   * GET /api/subscription/usage
   * Obter uso mensal de transações
   */
  async getMonthlyUsage(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
        });
        return;
      }

      const usage = await subscriptionService.getMonthlyUsage(userId);

      res.json({
        success: true,
        data: usage,
      });
    } catch (error: any) {
      console.error('Erro ao obter uso mensal:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao obter uso mensal',
      });
    }
  }
}

export const subscriptionController = new SubscriptionController();
