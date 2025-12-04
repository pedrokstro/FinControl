import { AppDataSource } from '@/config/database';
import { Notification, NotificationType, NotificationCategory } from '@/models/Notification';

export class NotificationService {
  private notificationRepository = AppDataSource.getRepository(Notification);

  /**
   * Criar nova notificação
   */
  async create(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = 'info',
    category?: NotificationCategory,
    relatedId?: string,
    relatedType?: string
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId,
      title,
      message,
      type,
      category,
      relatedId,
      relatedType,
    });

    return await this.notificationRepository.save(notification);
  }

  /**
   * Buscar todas as notificações do usuário
   */
  async findAll(userId: string, limit = 50, onlyUnread = false): Promise<Notification[]> {
    const query = this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC')
      .take(limit);

    if (onlyUnread) {
      query.andWhere('notification.isRead = :isRead', { isRead: false });
    }

    return await query.getMany();
  }

  /**
   * Contar notificações não lidas
   */
  async countUnread(userId: string): Promise<number> {
    return await this.notificationRepository.count({
      where: { userId, isRead: false },
    });
  }

  /**
   * Marcar notificação como lida
   */
  async markAsRead(id: string, userId: string): Promise<Notification | null> {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    });

    if (!notification) {
      return null;
    }

    notification.isRead = true;
    return await this.notificationRepository.save(notification);
  }

  /**
   * Marcar todas como lidas
   */
  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ isRead: true })
      .where('userId = :userId', { userId })
      .andWhere('isRead = :isRead', { isRead: false })
      .execute();
  }

  /**
   * Deletar notificação
   */
  async delete(id: string, userId: string): Promise<boolean> {
    const result = await this.notificationRepository.delete({ id, userId });
    return result.affected ? result.affected > 0 : false;
  }

  /**
   * Deletar todas as notificações lidas
   */
  async deleteAllRead(userId: string): Promise<number> {
    const result = await this.notificationRepository.delete({
      userId,
      isRead: true,
    });
    return result.affected || 0;
  }
}

export default new NotificationService();
