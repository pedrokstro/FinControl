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

  /**
   * Obter todos os cards de aviso (para o painel admin)
   * GET /api/v1/admin/dashboard-cards
   */
  async getDashboardCards(_req: Request, res: Response, next: NextFunction) {
    try {
      const cards = await AppDataSource.query(
        'SELECT id, title, desc_text as "desc", icon, image_src as "imageSrc", bg, text_color as "textColor", desc_color as "descColor", icon_color as "iconColor", icon_bg as "iconBg", action_path as "actionPath", is_active as "isActive" FROM public.dashboard_cards ORDER BY created_at DESC'
      );
      res.json({
        success: true,
        data: cards,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Criar um novo card de aviso
   * POST /api/v1/admin/dashboard-cards
   */
  async createDashboardCard(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        title,
        desc,
        icon,
        imageSrc,
        bg = 'bg-white dark:bg-neutral-900 border border-gray-200/60 dark:border-neutral-800/85 shadow-sm',
        textColor = 'text-gray-900 dark:text-white',
        descColor = 'text-gray-500 dark:text-neutral-400',
        iconColor = 'text-primary-600 dark:text-primary-400',
        iconBg = 'bg-primary-50 dark:bg-primary-950/20',
        actionPath = '/app/dashboard',
        isActive = true
      } = req.body;

      if (!title || !desc) {
        return res.status(400).json({
          success: false,
          message: 'Título e descrição são obrigatórios',
        });
      }

      const result = await AppDataSource.query(
        `INSERT INTO public.dashboard_cards (title, desc_text, icon, image_src, bg, text_color, desc_color, icon_color, icon_bg, action_path, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id`,
        [title, desc, icon, imageSrc, bg, textColor, descColor, iconColor, iconBg, actionPath, isActive]
      );

      res.json({
        success: true,
        message: 'Card criado com sucesso',
        data: { id: result[0].id },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualizar um card de aviso existente
   * PUT /api/v1/admin/dashboard-cards/:id
   */
  async updateDashboardCard(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const {
        title,
        desc,
        icon,
        imageSrc,
        bg,
        textColor,
        descColor,
        iconColor,
        iconBg,
        actionPath,
        isActive
      } = req.body;

      if (!title || !desc) {
        return res.status(400).json({
          success: false,
          message: 'Título e descrição são obrigatórios',
        });
      }

      await AppDataSource.query(
        `UPDATE public.dashboard_cards 
         SET title = $1, desc_text = $2, icon = $3, image_src = $4, bg = $5, text_color = $6, desc_color = $7, icon_color = $8, icon_bg = $9, action_path = $10, is_active = $11
         WHERE id = $12`,
        [title, desc, icon, imageSrc, bg, textColor, descColor, iconColor, iconBg, actionPath, isActive, id]
      );

      res.json({
        success: true,
        message: 'Card atualizado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletar um card de aviso existente
   * DELETE /api/v1/admin/dashboard-cards/:id
   */
  async deleteDashboardCard(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await AppDataSource.query('DELETE FROM public.dashboard_cards WHERE id = $1', [id]);
      res.json({
        success: true,
        message: 'Card removido com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
