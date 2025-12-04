import { Request, Response, NextFunction } from 'express';
import notificationService from '@/services/notification.service';

export class NotificationController {
  /**
   * Listar notificações do usuário
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { limit = 50, onlyUnread = false } = req.query;

      const notifications = await notificationService.findAll(
        userId,
        Number(limit),
        onlyUnread === 'true'
      );

      const unreadCount = await notificationService.countUnread(userId);

      res.json({
        success: true,
        data: {
          notifications,
          unreadCount,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Contar notificações não lidas
   */
  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const count = await notificationService.countUnread(userId);

      res.json({
        success: true,
        data: { count },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Marcar notificação como lida
   */
  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const notification = await notificationService.markAsRead(id, userId);

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notificação não encontrada',
        });
      }

      res.json({
        success: true,
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Marcar todas como lidas
   */
  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      await notificationService.markAllAsRead(userId);

      res.json({
        success: true,
        message: 'Todas as notificações foram marcadas como lidas',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletar notificação
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const deleted = await notificationService.delete(id, userId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Notificação não encontrada',
        });
      }

      res.json({
        success: true,
        message: 'Notificação deletada com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletar todas as lidas
   */
  async deleteAllRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const count = await notificationService.deleteAllRead(userId);

      res.json({
        success: true,
        message: `${count} notificação(ões) deletada(s)`,
        data: { count },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificationController();
