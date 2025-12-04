import { Router } from 'express';
import { subscriptionController } from '../controllers/subscription.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @route   GET /api/subscription/status
 * @desc    Obter status da assinatura do usuário
 * @access  Private
 */
router.get('/status', authenticate, (req, res) =>
  subscriptionController.getStatus(req, res)
);

/**
 * @route   GET /api/subscription/features
 * @desc    Obter features disponíveis para o usuário
 * @access  Private
 */
router.get('/features', authenticate, (req, res) =>
  subscriptionController.getFeatures(req, res)
);

/**
 * @route   POST /api/subscription/activate
 * @desc    Ativar plano premium
 * @access  Private
 */
router.post('/activate', authenticate, (req, res) =>
  subscriptionController.activate(req, res)
);

/**
 * @route   POST /api/subscription/renew
 * @desc    Renovar plano premium
 * @access  Private
 */
router.post('/renew', authenticate, (req, res) =>
  subscriptionController.renew(req, res)
);

/**
 * @route   POST /api/subscription/cancel
 * @desc    Cancelar plano premium
 * @access  Private
 */
router.post('/cancel', authenticate, (req, res) =>
  subscriptionController.cancel(req, res)
);

/**
 * @route   POST /api/subscription/google-pay
 * @desc    Processar pagamento via Google Pay
 * @access  Private
 */
router.post('/google-pay', authenticate, (req, res) =>
  subscriptionController.processGooglePay(req, res)
);

/**
 * @route   POST /api/subscription/start-trial
 * @desc    Iniciar período de teste grátis de 7 dias
 * @access  Private
 */
router.post('/start-trial', authenticate, (req, res) =>
  subscriptionController.startTrial(req, res)
);

export default router;
