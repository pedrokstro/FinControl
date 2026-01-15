import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { googlePlayController } from '../controllers/googlePlay.controller';

const router = Router();

/**
 * @route   POST /api/google-play/verify-purchase
 * @desc    Verificar e ativar assinatura após compra no Google Play
 * @access  Private
 */
router.post('/verify-purchase', authenticate, googlePlayController.verifyPurchase);

/**
 * @route   POST /api/google-play/webhook
 * @desc    Receber notificações em tempo real do Google Play (RTDN)
 * @access  Public (autenticado via Google Cloud Pub/Sub)
 */
router.post('/webhook', googlePlayController.handleWebhook);

/**
 * @route   POST /api/google-play/cancel-subscription
 * @desc    Cancelar assinatura do Google Play
 * @access  Private
 */
router.post('/cancel-subscription', authenticate, googlePlayController.cancelSubscription);

/**
 * @route   GET /api/google-play/subscription-status
 * @desc    Obter status atual da assinatura no Google Play
 * @access  Private
 */
router.get('/subscription-status', authenticate, googlePlayController.getSubscriptionStatus);

export default router;
