import notificationService from './notification.service';
import { AppDataSource } from '@/config/database';

/**
 * Serviço de Notificações Inteligentes
 * Envia notificações automáticas baseadas em análise de dados
 */
export class SmartNotificationService {
  /**
   * Analisar transação e enviar notificações relevantes
   */
  async analyzeTransaction(userId: string, transaction: any): Promise<void> {
    const { type, amount, category, description } = transaction;

    // 1. Notificação de transação criada
    await this.notifyTransactionCreated(userId, type, amount, description);

    // 2. Analisar gastos do mês
    await this.analyzeMonthlyExpenses(userId);

    // 3. Sugerir investimento se for receita
    if (type === 'income') {
      await this.suggestInvestment(userId, amount);
    }

    // 4. Alertar sobre gastos em categoria específica
    if (type === 'expense') {
      await this.analyzeCategoryExpenses(userId, category);
    }

    // 5. Dicas de economia baseadas em padrões
    await this.sendSavingsTips(userId);
  }

  /**
   * Notificar criação de transação
   */
  private async notifyTransactionCreated(
    userId: string,
    type: string,
    amount: number,
    description: string
  ): Promise<void> {
    const emoji = type === 'income' ? '💰' : '💸';
    const title = type === 'income' ? 'Nova Receita Registrada' : 'Nova Despesa Registrada';
    const message = `${description} - R$ ${amount.toFixed(2)}`;

    await notificationService.create(
      userId,
      `${emoji} ${title}`,
      message,
      type === 'income' ? 'success' : 'info',
      'transaction'
    );
  }

  /**
   * Analisar gastos mensais e alertar
   */
  private async analyzeMonthlyExpenses(userId: string): Promise<void> {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const query = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense
      FROM transactions
      WHERE "userId" = $1
        AND EXTRACT(MONTH FROM CAST(date AS DATE)) = $2
        AND EXTRACT(YEAR FROM CAST(date AS DATE)) = $3
    `;

    const result = await AppDataSource.manager.query(query, [userId, month, year]);
    const { income, expense } = result[0];
    const totalIncome = parseFloat(income);
    const totalExpense = parseFloat(expense);
    const balance = totalIncome - totalExpense;
    const expensePercentage = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

    // Alertar se gastos > 80% da receita
    if (expensePercentage > 80 && totalIncome > 0) {
      await notificationService.create(
        userId,
        '⚠️ Atenção aos Gastos',
        `Você já gastou ${expensePercentage.toFixed(0)}% da sua receita este mês (R$ ${totalExpense.toFixed(2)} de R$ ${totalIncome.toFixed(2)}). Considere reduzir gastos não essenciais.`,
        'warning',
        'budget'
      );
    }

    // Parabenizar se gastos < 50% da receita
    if (expensePercentage < 50 && totalIncome > 500 && totalExpense > 0) {
      await notificationService.create(
        userId,
        '🎉 Parabéns!',
        `Você está economizando bem! Gastou apenas ${expensePercentage.toFixed(0)}% da sua receita. Saldo disponível: R$ ${balance.toFixed(2)}`,
        'success',
        'goal'
      );
    }
  }

  /**
   * Sugerir investimento quando receber receita
   */
  private async suggestInvestment(userId: string, amount: number): Promise<void> {
    // Sugerir investir 10-20% da receita
    const suggestedAmount = amount * 0.15; // 15%

    if (amount >= 500) {
      await notificationService.create(
        userId,
        '💡 Dica de Investimento',
        `Que tal investir R$ ${suggestedAmount.toFixed(2)} (15%) desta receita? Pequenos investimentos regulares podem gerar grandes resultados no futuro!`,
        'info',
        'goal'
      );
    }
  }

  /**
   * Analisar gastos por categoria
   */
  private async analyzeCategoryExpenses(userId: string, category: string): Promise<void> {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const query = `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM transactions
      WHERE "userId" = $1
        AND type = 'expense'
        AND category = $2
        AND EXTRACT(MONTH FROM CAST(date AS DATE)) = $3
        AND EXTRACT(YEAR FROM CAST(date AS DATE)) = $4
    `;

    const result = await AppDataSource.manager.query(query, [userId, category, month, year]);
    const categoryTotal = parseFloat(result[0].total);

    // Alertar se gastos em categoria > R$ 1000
    if (categoryTotal > 1000) {
      const categoryNames: Record<string, string> = {
        food: 'Alimentação',
        transport: 'Transporte',
        entertainment: 'Entretenimento',
        shopping: 'Compras',
        health: 'Saúde',
        education: 'Educação',
        bills: 'Contas',
        others: 'Outros',
      };

      const categoryName = categoryNames[category] || category;

      await notificationService.create(
        userId,
        '📊 Análise de Gastos',
        `Você já gastou R$ ${categoryTotal.toFixed(2)} em ${categoryName} este mês. Revise seus gastos nesta categoria para economizar mais.`,
        'info',
        'budget'
      );
    }
  }

  /**
   * Enviar dicas de economia baseadas em padrões
   */
  async sendSavingsTips(userId: string): Promise<void> {
    // Verificar se já enviou dica hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const recentTip = await AppDataSource.manager.query(
      `SELECT * FROM notifications 
       WHERE "userId" = $1 
       AND title LIKE '%Dica%'
       AND "createdAt" >= $2
       LIMIT 1`,
      [userId, today]
    );

    if (recentTip.length > 0) {
      return; // Já enviou dica hoje
    }

    // Lista de dicas rotativas
    const tips = [
      {
        title: '💡 Dica de Economia',
        message: 'Prepare suas refeições em casa! Você pode economizar até 70% comparado a comer fora todos os dias.',
      },
      {
        title: '💡 Dica de Investimento',
        message: 'Comece pequeno! Investir R$ 100 por mês com rendimento de 10% ao ano pode se tornar R$ 20.000 em 10 anos.',
      },
      {
        title: '💡 Dica de Economia',
        message: 'Cancele assinaturas que você não usa. Revise seus gastos mensais e elimine serviços desnecessários.',
      },
      {
        title: '💡 Dica Financeira',
        message: 'Regra 50-30-20: Use 50% da renda para necessidades, 30% para desejos e 20% para poupança/investimentos.',
      },
      {
        title: '💡 Dica de Economia',
        message: 'Evite compras por impulso! Espere 24 horas antes de comprar algo não essencial. Muitas vezes você perceberá que não precisa.',
      },
      {
        title: '💡 Dica de Investimento',
        message: 'Diversifique! Não coloque todos os ovos na mesma cesta. Distribua seus investimentos em diferentes tipos de ativos.',
      },
      {
        title: '💡 Dica Financeira',
        message: 'Crie um fundo de emergência! Tenha de 3 a 6 meses de despesas guardados para imprevistos.',
      },
      {
        title: '💡 Dica de Economia',
        message: 'Compare preços antes de comprar! Use aplicativos de comparação e aproveite promoções para economizar.',
      },
    ];

    // Escolher dica aleatória
    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    await notificationService.create(
      userId,
      randomTip.title,
      randomTip.message,
      'info',
      'system'
    );
  }

  /**
   * Enviar notificações sobre funcionalidades do sistema
   */
  async sendFeatureTips(userId: string): Promise<void> {
    const features = [
      {
        title: '🎯 Conheça as Metas',
        message: 'Defina metas mensais de economia e acompanhe seu progresso em tempo real! Acesse a seção de Metas.',
      },
      {
        title: '📊 Dashboard Completo',
        message: 'Visualize gráficos detalhados de receitas, despesas e categorias no Dashboard. Tome decisões baseadas em dados!',
      },
      {
        title: '🔄 Transações Recorrentes',
        message: 'Configure transações recorrentes para não esquecer de registrar contas mensais como aluguel, internet, etc.',
      },
      {
        title: '📱 Categorias Personalizadas',
        message: 'Organize suas transações por categorias e veja onde você mais gasta. Use ícones exclusivos para personalizar!',
      },
      {
        title: '🔔 Notificações Inteligentes',
        message: 'Receba alertas sobre gastos elevados, metas atingidas e dicas de economia personalizadas.',
      },
    ];

    // Enviar uma feature tip aleatória
    const randomFeature = features[Math.floor(Math.random() * features.length)];

    await notificationService.create(
      userId,
      randomFeature.title,
      randomFeature.message,
      'info',
      'system'
    );
  }

  /**
   * Análise semanal de gastos (executar via cron)
   */
  async sendWeeklyAnalysis(userId: string): Promise<void> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const query = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense,
        COUNT(CASE WHEN type = 'expense' THEN 1 END) as expense_count
      FROM transactions
      WHERE "userId" = $1
        AND CAST(date AS DATE) >= $2
    `;

    const result = await AppDataSource.manager.query(query, [userId, weekAgo]);
    const { income, expense, expense_count } = result[0];
    const totalIncome = parseFloat(income);
    const totalExpense = parseFloat(expense);
    const avgDailyExpense = totalExpense / 7;

    await notificationService.create(
      userId,
      '📈 Resumo Semanal',
      `Última semana: ${expense_count} despesas totalizando R$ ${totalExpense.toFixed(2)}. Média diária: R$ ${avgDailyExpense.toFixed(2)}. ${totalIncome > 0 ? `Receitas: R$ ${totalIncome.toFixed(2)}` : 'Nenhuma receita registrada.'}`,
      'info',
      'system'
    );
  }
}

export default new SmartNotificationService();
