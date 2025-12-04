import api from '@/config/api';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  category?: 'transaction' | 'goal' | 'budget' | 'premium' | 'system';
  isRead: boolean;
  relatedId?: string;
  relatedType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  unreadCount: number;
}

class NotificationService {
  /**
   * Buscar todas as notificações
   */
  async getAll(limit = 50, onlyUnread = false): Promise<NotificationListResponse> {
    const response = await api.get('/notifications', {
      params: { limit, onlyUnread },
    });
    return response.data.data;
  }

  /**
   * Contar notificações não lidas
   */
  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread-count');
    return response.data.data.count;
  }

  /**
   * Marcar notificação como lida
   */
  async markAsRead(id: string): Promise<Notification> {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data.data;
  }

  /**
   * Marcar todas como lidas
   */
  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/read-all');
  }

  /**
   * Deletar notificação
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  }

  /**
   * Deletar todas as lidas
   */
  async deleteAllRead(): Promise<number> {
    const response = await api.delete('/notifications/read');
    return response.data.data.count;
  }
}

export default new NotificationService();
