import { Router } from 'express';
import notificationController from '@/controllers/notification.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

/**
 * @route   GET /api/v1/notifications
 * @desc    Listar notificações do usuário
 * @access  Private
 */
router.get('/', notificationController.getAll);

/**
 * @route   GET /api/v1/notifications/unread-count
 * @desc    Contar notificações não lidas
 * @access  Private
 */
router.get('/unread-count', notificationController.getUnreadCount);

/**
 * @route   PUT /api/v1/notifications/:id/read
 * @desc    Marcar notificação como lida
 * @access  Private
 */
router.put('/:id/read', notificationController.markAsRead);

/**
 * @route   PUT /api/v1/notifications/read-all
 * @desc    Marcar todas as notificações como lidas
 * @access  Private
 */
router.put('/read-all', notificationController.markAllAsRead);

/**
 * @route   DELETE /api/v1/notifications/:id
 * @desc    Deletar notificação
 * @access  Private
 */
router.delete('/:id', notificationController.delete);

/**
 * @route   DELETE /api/v1/notifications/read
 * @desc    Deletar todas as notificações lidas
 * @access  Private
 */
router.delete('/read', notificationController.deleteAllRead);

export default router;
