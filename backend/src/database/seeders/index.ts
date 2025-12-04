import { AppDataSource } from '@/config/database';
import { User } from '@/models/User';
import { Category, CategoryType } from '@/models/Category';
import { Transaction, TransactionType } from '@/models/Transaction';
import { logger } from '@/utils/logger';

export const runSeeders = async () => {
  try {
    logger.info('🌱 Starting seeders...');

    const userRepository = AppDataSource.getRepository(User);
    const categoryRepository = AppDataSource.getRepository(Category);
    const transactionRepository = AppDataSource.getRepository(Transaction);

    // Criar usuário demo
    let demoUser = await userRepository.findOne({ where: { email: 'demo@financeiro.com' } });
    
    if (!demoUser) {
      demoUser = userRepository.create({
        name: 'Usuário Demo',
        email: 'demo@financeiro.com',
        password: 'demo123',
      });
      await userRepository.save(demoUser);
      logger.info('✅ Demo user created');
    }

    // Verificar se já existem categorias para o usuário demo
    const existingCategoriesCount = await categoryRepository.count({
      where: { userId: demoUser.id }
    });

    // Só criar categorias padrão se o usuário não tiver NENHUMA categoria
    // (primeira vez ou nunca teve categorias)
    const categories: Category[] = [];
    
    if (existingCategoriesCount === 0) {
      const categoriesData = [
        // Receitas
        { name: 'Salário', type: CategoryType.INCOME, color: '#10b981', icon: 'DollarSign' },
        { name: 'Freelance', type: CategoryType.INCOME, color: '#3b82f6', icon: 'Briefcase' },
        { name: 'Investimentos', type: CategoryType.INCOME, color: '#8b5cf6', icon: 'TrendingUp' },
        { name: 'Outros', type: CategoryType.INCOME, color: '#6b7280', icon: 'Plus' },
        
        // Despesas
        { name: 'Alimentação', type: CategoryType.EXPENSE, color: '#ef4444', icon: 'Utensils' },
        { name: 'Transporte', type: CategoryType.EXPENSE, color: '#f59e0b', icon: 'Car' },
        { name: 'Moradia', type: CategoryType.EXPENSE, color: '#8b5cf6', icon: 'Home' },
        { name: 'Saúde', type: CategoryType.EXPENSE, color: '#ec4899', icon: 'Heart' },
        { name: 'Educação', type: CategoryType.EXPENSE, color: '#3b82f6', icon: 'BookOpen' },
        { name: 'Lazer', type: CategoryType.EXPENSE, color: '#14b8a6', icon: 'Smile' },
        { name: 'Compras', type: CategoryType.EXPENSE, color: '#f97316', icon: 'ShoppingBag' },
        { name: 'Contas', type: CategoryType.EXPENSE, color: '#6366f1', icon: 'FileText' },
      ];

      for (const catData of categoriesData) {
        const category = categoryRepository.create({
          ...catData,
          userId: demoUser.id,
        });
        await categoryRepository.save(category);
        categories.push(category);
      }
      logger.info('✅ Categories created (first time setup)');
    } else {
      // Carregar categorias existentes para usar nas transações
      const existingCategories = await categoryRepository.find({
        where: { userId: demoUser.id }
      });
      categories.push(...existingCategories);
      logger.info(`ℹ️  User already has ${existingCategoriesCount} categories, skipping creation`);
    }

    // Verificar se já existem transações para o usuário demo
    const existingTransactionsCount = await transactionRepository.count({
      where: { userId: demoUser.id }
    });

    // Criar transações de exemplo somente se:
    // 1. Houver categorias disponíveis
    // 2. Usuário não tiver NENHUMA transação
    // 3. Categorias foram criadas AGORA (primeira vez)
    const shouldCreateTransactions = categories.length > 0 && 
                                     existingTransactionsCount === 0 && 
                                     existingCategoriesCount === 0; // Só se categorias foram criadas agora
    
    if (shouldCreateTransactions) {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const transactionsData = [
      // Receitas
      {
        type: TransactionType.INCOME,
        amount: 5000,
        description: 'Salário',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-05`,
        categoryId: categories.find(c => c.name === 'Salário')!.id,
      },
      {
        type: TransactionType.INCOME,
        amount: 1500,
        description: 'Projeto freelance',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-15`,
        categoryId: categories.find(c => c.name === 'Freelance')!.id,
      },
      
      // Despesas
      {
        type: TransactionType.EXPENSE,
        amount: 350,
        description: 'Supermercado',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-08`,
        categoryId: categories.find(c => c.name === 'Alimentação')!.id,
      },
      {
        type: TransactionType.EXPENSE,
        amount: 150,
        description: 'Combustível',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-10`,
        categoryId: categories.find(c => c.name === 'Transporte')!.id,
      },
      {
        type: TransactionType.EXPENSE,
        amount: 1200,
        description: 'Aluguel',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`,
        categoryId: categories.find(c => c.name === 'Moradia')!.id,
      },
      {
        type: TransactionType.EXPENSE,
        amount: 200,
        description: 'Plano de saúde',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-05`,
        categoryId: categories.find(c => c.name === 'Saúde')!.id,
      },
      {
        type: TransactionType.EXPENSE,
        amount: 80,
        description: 'Cinema',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-12`,
        categoryId: categories.find(c => c.name === 'Lazer')!.id,
      },
      {
        type: TransactionType.EXPENSE,
        amount: 250,
        description: 'Conta de luz',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-07`,
        categoryId: categories.find(c => c.name === 'Contas')!.id,
      },
    ];

      // Criar todas as transações (já verificamos que não existem)
      for (const transData of transactionsData) {
        const transaction = transactionRepository.create({
          ...transData,
          userId: demoUser.id,
        });
        await transactionRepository.save(transaction);
      }
      logger.info('✅ Transactions created (first time setup)');
    } else if (categories.length === 0) {
      logger.info('ℹ️  No categories available, skipping transaction creation');
    } else {
      logger.info(`ℹ️  User already has ${existingTransactionsCount} transactions, skipping creation`);
    }

    logger.info('🎉 Seeders completed successfully!');
  } catch (error) {
    logger.error('❌ Error running seeders', error);
    throw error;
  }
};
