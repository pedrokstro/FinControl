import { Request, Response, NextFunction } from 'express';
import notificationService from '@/services/notification.service';
import { AppDataSource } from '@/config/database';
import { User } from '@/models/User';
import { Notification } from '@/models/Notification';

export class AdminController {
  /**
   * Obter estatísticas do sistema
   * GET /api/v1/admin/stats
   */
  async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const notificationRepository = AppDataSource.getRepository(Notification);

      // Contar total de usuários
      const totalUsers = await userRepository.count();

      // Contar usuários premium
      const premiumUsers = await userRepository.count({
        where: { isPremium: true },
      });

      // Contar notificações enviadas
      const totalNotifications = await notificationRepository.count();

      res.json({
        success: true,
        data: {
          totalUsers,
          premiumUsers,
          totalNotifications,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Listar todos os usuários
   * GET /api/v1/admin/users
   */
  async getUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const userRepository = AppDataSource.getRepository(User);

      // Buscar todos os usuários com informações básicas
      const users = await userRepository.find({
        select: ['id', 'name', 'email', 'isPremium', 'createdAt'],
        order: {
          createdAt: 'DESC',
        },
      });

      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Enviar notificação em massa
   * POST /api/v1/admin/broadcast-notification
   * Body: { title, message, type, category, onlyPremium }
   */
  async broadcastNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, message, type = 'info', category = 'system', onlyPremium = false } = req.body;

      if (!title || !message) {
        return res.status(400).json({
          success: false,
          message: 'Título e mensagem são obrigatórios',
        });
      }

      // Buscar usuários
      const userRepository = AppDataSource.getRepository(User);
      const query = userRepository.createQueryBuilder('user');

      if (onlyPremium) {
        query.where('user.isPremium = :isPremium', { isPremium: true });
      }

      const users = await query.getMany();

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Nenhum usuário encontrado',
        });
      }

      // Criar notificações para todos os usuários
      const notifications: any[] = [];
      for (const user of users) {
        const notification = await notificationService.create(
          user.id,
          title,
          message,
          type,
          category
        );
        notifications.push(notification);
      }

      res.json({
        success: true,
        message: `Notificação enviada para ${users.length} usuário(s)`,
        data: {
          count: users.length,
          onlyPremium,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Enviar notificação para usuário específico
   * POST /api/v1/admin/send-notification/:userId
   * Body: { title, message, type, category }
   */
  async sendNotificationToUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { title, message, type = 'info', category = 'system' } = req.body;

      if (!title || !message) {
        return res.status(400).json({
          success: false,
          message: 'Título e mensagem são obrigatórios',
        });
      }

      const notification = await notificationService.create(
        userId,
        title,
        message,
        type,
        category
      );

      res.json({
        success: true,
        message: 'Notificação enviada com sucesso',
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
