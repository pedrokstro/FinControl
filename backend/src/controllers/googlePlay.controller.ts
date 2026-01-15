import { Request, Response } from 'express';
import { googlePlayService } from '../services/googlePlay.service';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

/**
 * Controller para processar pagamentos do Google Play
 */
class GooglePlayController {
  /**
   * POST /api/google-play/verify-purchase
   * Verificar e ativar assinatura após compra no Google Play
   */
  async verifyPurchase(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { purchaseToken, subscriptionId, productId } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
        });
        return;
      }

      if (!purchaseToken || !subscriptionId) {
        res.status(400).json({
          success: false,
          message: 'purchaseToken e subscriptionId são obrigatórios',
        });
        return;
      }

      // Verificar compra no Google Play
      const verificationResult = await googlePlayService.verifySubscription(
        purchaseToken,
        subscriptionId
      );

      if (!verificationResult.isValid) {
        res.status(400).json({
          success: false,
          message: 'Compra inválida ou expirada',
          error: verificationResult.error,
        });
        return;
      }

      // Reconhecer a compra (acknowledge)
      await googlePlayService.acknowledgePurchase(purchaseToken, subscriptionId);

      // Atualizar usuário para premium
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado',
        });
        return;
      }

      // Ativar plano premium
      user.isPremium = true;
      user.planType = 'premium';
      user.planStartDate = new Date();
      user.planEndDate = verificationResult.expiryDate || null;
      user.subscriptionStatus = 'active';

      // Salvar dados da compra do Google Play
      user.googlePlayPurchaseToken = purchaseToken;
      user.googlePlaySubscriptionId = subscriptionId;
      user.googlePlayOrderId = verificationResult.orderId || null;

      await userRepository.save(user);

      console.log('✅ Google Play subscription activated for user:', userId);

      res.json({
        success: true,
        message: 'Assinatura ativada com sucesso!',
        data: {
          isPremium: true,
          planType: 'premium',
          expiryDate: verificationResult.expiryDate,
          autoRenewing: verificationResult.autoRenewing,
        },
      });
    } catch (error: any) {
      console.error('Error verifying Google Play purchase:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao verificar compra',
      });
    }
  }

  /**
   * POST /api/google-play/webhook
   * Receber notificações em tempo real do Google Play
   * (Real-time Developer Notifications - RTDN)
   */
  async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { message } = req.body;

      if (!message || !message.data) {
        res.status(400).json({
          success: false,
          message: 'Invalid notification format',
        });
        return;
      }

      // Decodificar mensagem base64
      const decodedData = Buffer.from(message.data, 'base64').toString('utf-8');
      const notificationData = JSON.parse(decodedData);

      console.log('📬 Received Google Play notification:', notificationData);

      // Processar notificação
      await googlePlayService.processNotification(notificationData);

      // Atualizar status do usuário baseado na notificação
      const { subscriptionNotification } = notificationData;
      
      if (subscriptionNotification) {
        const { purchaseToken, notificationType } = subscriptionNotification;

        // Buscar usuário pelo purchaseToken
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
          where: { googlePlayPurchaseToken: purchaseToken },
        });

        if (user) {
          // Atualizar status baseado no tipo de notificação
          switch (notificationType) {
            case 2: // RENEWED
            case 4: // PURCHASED
              user.subscriptionStatus = 'active';
              user.isPremium = true;
              break;
            case 3: // CANCELED
              user.subscriptionStatus = 'canceled';
              break;
            case 13: // EXPIRED
              user.subscriptionStatus = 'expired';
              user.isPremium = false;
              user.planType = 'free';
              break;
            case 12: // REVOKED
              user.subscriptionStatus = 'revoked';
              user.isPremium = false;
              user.planType = 'free';
              break;
          }

          await userRepository.save(user);
          console.log('✅ User subscription status updated:', user.id);
        }
      }

      // Sempre retornar 200 OK para o Google Play
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Error processing Google Play webhook:', error);
      // Ainda retornar 200 para evitar reenvios
      res.status(200).json({ success: true });
    }
  }

  /**
   * POST /api/google-play/cancel-subscription
   * Cancelar assinatura do usuário
   */
  async cancelSubscription(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

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

      if (!user.googlePlayPurchaseToken || !user.googlePlaySubscriptionId) {
        res.status(400).json({
          success: false,
          message: 'Nenhuma assinatura ativa do Google Play encontrada',
        });
        return;
      }

      // Cancelar no Google Play
      const cancelled = await googlePlayService.cancelSubscription(
        user.googlePlayPurchaseToken,
        user.googlePlaySubscriptionId
      );

      if (!cancelled) {
        res.status(500).json({
          success: false,
          message: 'Erro ao cancelar assinatura no Google Play',
        });
        return;
      }

      // Atualizar status do usuário
      user.subscriptionStatus = 'canceled';

      await userRepository.save(user);

      res.json({
        success: true,
        message: 'Assinatura cancelada com sucesso. Você ainda terá acesso premium até o fim do período pago.',
      });
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao cancelar assinatura',
      });
    }
  }

  /**
   * GET /api/google-play/subscription-status
   * Verificar status atual da assinatura no Google Play
   */
  async getSubscriptionStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

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

      if (!user.googlePlayPurchaseToken || !user.googlePlaySubscriptionId) {
        res.json({
          success: true,
          data: {
            hasGooglePlaySubscription: false,
            isPremium: user.isPremium,
            planType: user.planType,
          },
        });
        return;
      }

      // Verificar status no Google Play
      const details = await googlePlayService.getSubscriptionDetails(
        user.googlePlayPurchaseToken,
        user.googlePlaySubscriptionId
      );

      if (!details) {
        res.status(500).json({
          success: false,
          message: 'Erro ao obter detalhes da assinatura',
        });
        return;
      }

      const expiryDate = new Date(parseInt(details.expiryTimeMillis));
      const isActive = expiryDate > new Date();

      res.json({
        success: true,
        data: {
          hasGooglePlaySubscription: true,
          isActive,
          autoRenewing: details.autoRenewing,
          expiryDate,
          orderId: details.orderId,
          isPremium: user.isPremium,
          planType: user.planType,
        },
      });
    } catch (error: any) {
      console.error('Error getting subscription status:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao obter status da assinatura',
      });
    }
  }
}

export const googlePlayController = new GooglePlayController();
