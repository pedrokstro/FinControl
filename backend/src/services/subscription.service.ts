import { AppDataSource } from '../config/database';
import { User } from '../models/User';

export class SubscriptionService {
  private userRepository = AppDataSource.getRepository(User);

  /**
   * Obter status da assinatura do usuário
   */
  async getSubscriptionStatus(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const isActive = user.isPlanActive();
    const daysRemaining = this.calculateDaysRemaining(user.planEndDate);

    return {
      planType: user.planType,
      isPremium: isActive,
      isActive: isActive,
      planStartDate: user.planStartDate,
      planEndDate: user.planEndDate,
      daysRemaining,
      features: this.getAvailableFeatures(user),
    };
  }

  /**
   * Ativar plano premium
   */
  async activatePremiumPlan(
    userId: string,
    durationMonths: number = 1,
    googlePayTransactionId?: string
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + durationMonths);

    user.planType = 'premium';
    user.planStartDate = now;
    user.planEndDate = endDate;
    user.isPremium = true;
    user.subscriptionStatus = 'active';
    
    if (googlePayTransactionId) {
      user.googlePayTransactionId = googlePayTransactionId;
    }

    await this.userRepository.save(user);

    return user;
  }

  /**
   * Processar pagamento via Google Pay
   */
  async processGooglePaySubscription(
    userId: string,
    paymentData: any
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Validar dados do pagamento
      if (!paymentData || !paymentData.transactionId) {
        return { success: false, error: 'Dados de pagamento inválidos' };
      }

      // Ativar plano premium (1 mês por padrão)
      const user = await this.activatePremiumPlan(
        userId,
        1,
        paymentData.transactionId
      );

      console.log(`✅ Assinatura Premium ativada via Google Pay para usuário ${userId}`);
      console.log(`   Transaction ID: ${paymentData.transactionId}`);

      return { success: true, user };
    } catch (error) {
      console.error('❌ Erro ao processar pagamento Google Pay:', error);
      return { success: false, error: 'Erro ao processar pagamento' };
    }
  }

  /**
   * Cancelar plano premium
   */
  async cancelPremiumPlan(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    user.planType = 'free';
    user.planEndDate = new Date(); // Expira imediatamente
    user.isPremium = false;
    user.subscriptionStatus = 'cancelled';

    await this.userRepository.save(user);

    return user;
  }

  /**
   * Renovar plano premium
   */
  async renewPremiumPlan(
    userId: string,
    durationMonths: number = 1
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Se o plano ainda está ativo, estender a partir da data de fim atual
    // Caso contrário, começar a partir de agora
    const startDate = user.isPlanActive() && user.planEndDate
      ? new Date(user.planEndDate)
      : new Date();

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);

    user.planType = 'premium';
    if (!user.planStartDate) {
      user.planStartDate = new Date();
    }
    user.planEndDate = endDate;
    user.isPremium = true;

    await this.userRepository.save(user);

    return user;
  }

  /**
   * Verificar e expirar planos vencidos
   */
  async expireOldPlans(): Promise<number> {
    const now = new Date();

    const result = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        planType: 'free',
        isPremium: false,
      })
      .where('planEndDate < :now', { now })
      .andWhere('planType = :planType', { planType: 'premium' })
      .execute();

    return result.affected || 0;
  }

  /**
   * Obter features disponíveis para o usuário
   */
  private getAvailableFeatures(user: User): string[] {
    const allFeatures = [
      'basic_categories',
      'basic_transactions',
      'basic_reports',
      'advanced_emojis',
      'custom_categories',
      'advanced_reports',
      'export_unlimited',
      'priority_support',
    ];

    return allFeatures.filter((feature) => user.hasFeatureAccess(feature));
  }

  /**
   * Iniciar período de teste grátis de 7 dias
   */
  async startTrial(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se já usou o trial
    if (user.isTrial) {
      throw new Error('Você já utilizou o período de teste grátis');
    }

    // Verificar se já é premium
    if (user.isPremium) {
      throw new Error('Você já possui um plano Premium ativo');
    }

    const now = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // 7 dias de teste

    user.planType = 'premium';
    user.planStartDate = now;
    user.planEndDate = endDate;
    user.isPremium = true;
    user.isTrial = true;
    user.subscriptionStatus = 'active';

    await this.userRepository.save(user);

    return user;
  }

  /**
   * Calcular dias restantes do plano
   */
  private calculateDaysRemaining(endDate: Date | null): number | null {
    if (!endDate) return null;

    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  }

  /**
   * Contar transações do usuário no mês atual
   */
  async getMonthlyTransactionCount(userId: string): Promise<number> {
    const { Transaction } = await import('../models/Transaction');
    const transactionRepository = AppDataSource.getRepository(Transaction);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const count = await transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.userId = :userId', { userId })
      .andWhere('transaction.date >= :startOfMonth', { startOfMonth })
      .andWhere('transaction.date <= :endOfMonth', { endOfMonth })
      .getCount();

    return count;
  }

  /**
   * Verificar se usuário pode criar mais transações
   */
  async canCreateTransaction(userId: string): Promise<{
    allowed: boolean;
    currentCount: number;
    limit: number;
    message?: string;
  }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Premium tem transações ilimitadas
    if (user.isPlanActive()) {
      return {
        allowed: true,
        currentCount: 0,
        limit: -1, // Unlimited
      };
    }

    // Free plan tem limite de 10 transações/mês
    const currentCount = await this.getMonthlyTransactionCount(userId);
    const limit = User.FREE_PLAN_TRANSACTION_LIMIT;

    if (currentCount >= limit) {
      return {
        allowed: false,
        currentCount,
        limit,
        message: `Você atingiu o limite de ${limit} transações mensais do plano gratuito. Faça upgrade para Premium para transações ilimitadas.`,
      };
    }

    return {
      allowed: true,
      currentCount,
      limit,
    };
  }

  /**
   * Obter uso mensal de transações
   */
  async getMonthlyUsage(userId: string): Promise<{
    currentCount: number;
    limit: number;
    percentage: number;
    isPremium: boolean;
  }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const isPremium = user.isPlanActive();
    const currentCount = await this.getMonthlyTransactionCount(userId);
    const limit = isPremium ? -1 : User.FREE_PLAN_TRANSACTION_LIMIT;
    const percentage = isPremium ? 0 : Math.min((currentCount / limit) * 100, 100);

    return {
      currentCount,
      limit,
      percentage,
      isPremium,
    };
  }
}

export const subscriptionService = new SubscriptionService();
