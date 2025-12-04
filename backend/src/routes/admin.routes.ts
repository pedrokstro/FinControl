import { Router } from 'express';
import adminController from '@/controllers/admin.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { requireAdmin } from '@/middlewares/admin.middleware';

const router = Router();

// Todas as rotas requerem autenticação E permissão de admin
router.use(authenticate);
router.use(requireAdmin);

/**
 * @route   GET /api/v1/admin/stats
 * @desc    Obter estatísticas do sistema
 * @access  Private (Admin)
 */
router.get('/stats', adminController.getStats);

/**
 * @route   GET /api/v1/admin/users
 * @desc    Listar todos os usuários
 * @access  Private (Admin)
 */
router.get('/users', adminController.getUsers);

/**
 * @route   POST /api/v1/admin/broadcast-notification
 * @desc    Enviar notificação em massa
 * @access  Private (Admin)
 * @body    { title, message, type?, category?, onlyPremium? }
 */
router.post('/broadcast-notification', adminController.broadcastNotification);

/**
 * @route   POST /api/v1/admin/send-notification/:userId
 * @desc    Enviar notificação para usuário específico
 * @access  Private (Admin)
 * @body    { title, message, type?, category? }
 */
router.post('/send-notification/:userId', adminController.sendNotificationToUser);

export default router;
