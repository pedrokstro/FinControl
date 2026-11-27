import notificationService from '@/services/notification.service';
import { NotificationType, NotificationCategory } from '@/models/Notification';

/**
 * Helper para criar notificações automáticas em eventos do sistema
 */
export class NotificationHelper {
  /**
   * Notificação de nova transação criada
   */
  static async notifyNewTransaction(
    userId: string,
    transactionType: 'income' | 'expense',
    amount: number,
    description: string,
    transactionId: string
  ) {
    const title = transactionType === 'income' ? 'Nova Receita' : 'Nova Despesa';
    const message = `${description} - R$ ${amount.toFixed(2)}`;

    await notificationService.create(
      userId,
      title,
      message,
      'info',
      'transaction',
      transactionId,
      'transaction'
    );
  }

  /**
   * Notificação de meta de economia atingida
   */
  static async notifyGoalAchieved(
    userId: string,
    goalName: string,
    percentage: number,
    goalId: string
  ) {
    const title = percentage >= 100 ? 'Meta Atingida!' : 'Progresso da Meta';
    const message = `Você atingiu ${percentage}% da meta "${goalName}"!`;

    await notificationService.create(
      userId,
      title,
      message,
      percentage >= 100 ? 'success' : 'info',
      'goal',
      goalId,
      'goal'
    );
  }

  /**
   * Notificação de gastos elevados
   */
  static async notifyHighExpenses(
    userId: string,
    totalExpenses: number,
    limit: number
  ) {
    const title = 'Gastos Elevados';
    const message = `Seus gastos este mês (R$ ${totalExpenses.toFixed(2)}) ultrapassaram R$ ${limit.toFixed(2)}`;

    await notificationService.create(
      userId,
      title,
      message,
      'warning',
      'budget'
    );
  }

  /**
   * Notificação de saldo baixo
   */
  static async notifyLowBalance(
    userId: string,
    currentBalance: number,
    threshold: number
  ) {
    const title = 'Saldo Baixo';
    const message = `Seu saldo atual (R$ ${currentBalance.toFixed(2)}) está abaixo de R$ ${threshold.toFixed(2)}`;

    await notificationService.create(
      userId,
      title,
      message,
      'warning',
      'budget'
    );
  }

  /**
   * Notificação de transação recorrente processada
   */
  static async notifyRecurringTransaction(
    userId: string,
    description: string,
    amount: number,
    transactionId: string
  ) {
    const title = 'Transação Recorrente';
    const message = `${description} - R$ ${amount.toFixed(2)} foi processada automaticamente`;

    await notificationService.create(
      userId,
      title,
      message,
      'info',
      'transaction',
      transactionId,
      'transaction'
    );
  }

  /**
   * Notificação de plano Premium expirando
   */
  static async notifyPremiumExpiring(
    userId: string,
    daysRemaining: number
  ) {
    const title = 'Plano Premium';
    const message = `Seu plano Premium expira em ${daysRemaining} dia(s)`;

    await notificationService.create(
      userId,
      title,
      message,
      'warning',
      'premium'
    );
  }

  /**
   * Notificação de boas-vindas
   */
  static async notifyWelcome(userId: string, userName: string) {
    const title = 'Bem-vindo ao FinControl!';
    const message = `Olá ${userName}! Explore todas as funcionalidades do sistema de controle financeiro.`;

    await notificationService.create(
      userId,
      title,
      message,
      'success',
      'system'
    );
  }

  /**
   * Notificação de limite de categoria atingido
   */
  static async notifyCategoryLimitReached(
    userId: string,
    categoryName: string,
    spent: number,
    limit: number,
    percentage: number
  ) {
    const title = percentage >= 100 ? 'Limite Ultrapassado' : 'Atenção ao Limite';
    const message = `Você gastou R$ ${spent.toFixed(2)} (${percentage}%) do limite de R$ ${limit.toFixed(2)} em ${categoryName}`;

    await notificationService.create(
      userId,
      title,
      message,
      percentage >= 100 ? 'error' : 'warning',
      'budget'
    );
  }
}
