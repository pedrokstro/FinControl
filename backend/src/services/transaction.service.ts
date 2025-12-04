import { AppDataSource } from '@/config/database';
import { Transaction, TransactionType } from '@/models/Transaction';
import { NotFoundError } from '@/utils/errors';
import { Between } from 'typeorm';

export class TransactionService {
  private transactionRepository = AppDataSource.getRepository(Transaction);

  async create(userId: string, data: any) {
    // Log para debug - TIMEZONE FIX ATIVO
    console.log('📅 [DEBUG] Data recebida:', data.date, 'Tipo:', typeof data.date);
    
    // Garantir que a data seja tratada corretamente
    // IMPORTANTE: Adicionar 1 dia para compensar o timezone do frontend (UTC-3)
    let transactionDate: string;
    if (data.date) {
      let dateObj: Date;
      
      if (typeof data.date === 'string') {
        // Parse da string no formato YYYY-MM-DD ou DD/MM/YYYY
        if (data.date.includes('/')) {
          const [day, month, year] = data.date.split('/').map(Number);
          dateObj = new Date(year, month - 1, day);
        } else {
          const [year, month, day] = data.date.split('-').map(Number);
          dateObj = new Date(year, month - 1, day);
        }
      } else {
        console.log('📅 [DEBUG] Data recebida como objeto Date');
        dateObj = new Date(data.date);
      }
      
      console.log('📅 [DEBUG] Data antes de ajuste:', dateObj.toISOString());
      
      // ADICIONAR dias conforme configuração de timezone
      // Desenvolvimento (UTC-3): +1 dia
      // Produção (UTC+0): +0 dias
      const timezoneOffset = parseInt(process.env.TIMEZONE_DATE_OFFSET || '1', 10);
      if (timezoneOffset > 0) {
        dateObj.setDate(dateObj.getDate() + timezoneOffset);
      }
      
      console.log('📅 [DEBUG] Data depois de ajuste (+' + timezoneOffset + ' dia):', dateObj.toISOString());
      
      // USAR UTC para evitar problemas de timezone
      const year = dateObj.getUTCFullYear();
      const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getUTCDate()).padStart(2, '0');
      transactionDate = `${year}-${month}-${day}`;
      
      console.log('📅 [DEBUG] Data original:', data.date);
      console.log('📅 [DEBUG] Data final salva:', transactionDate);
    } else {
      // Se não vier data, usar hoje + 1 dia
      const today = new Date();
      today.setDate(today.getDate() + 1);
      transactionDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }
    
    // Log dos parâmetros que serão enviados
    console.log('💾 [DEBUG] Salvando transação com parâmetros:');
    console.log('  - Data:', transactionDate);
    console.log('  - Tipo:', data.type);
    console.log('  - Descrição:', data.description);
    
    // Criar transação usando TypeORM
    const transaction = this.transactionRepository.create({
      type: data.type,
      amount: data.amount,
      description: data.description,
      date: transactionDate,
      categoryId: data.categoryId,
      userId: userId,
      isRecurring: data.isRecurring || false,
      recurrenceType: data.recurrenceType || null,
      recurrenceEndDate: data.recurrenceEndDate || null,
      nextOccurrence: data.nextOccurrence || null,
      parentTransactionId: data.parentTransactionId || null,
    });
    
    const savedTransaction = await this.transactionRepository.save(transaction);
    
    console.log('✅ [DEBUG] Transação criada com ID:', savedTransaction.id);
    
    return this.transactionRepository.findOne({
      where: { id: savedTransaction.id },
      relations: ['category'],
    });
  }

  async findAll(userId: string, filters: any) {
    console.log('🔍 [DEBUG] Buscando transações...');
    const { 
      month, 
      year, 
      type, 
      categoryId, 
      page = 1, 
      limit = 10, 
      sortBy = 'date', 
      sortOrder = 'desc' 
    } = filters;
    
    const where: any = { userId };
    
    if (type) {
      where.type = type;
    }
    
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Filtro por mês/ano
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      where.date = Between(startDate, endDate);
    } else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
      where.date = Between(startDate, endDate);
    }

    const [transactions, total] = await this.transactionRepository.findAndCount({
      where,
      relations: ['category'],
      order: { [sortBy]: sortOrder.toUpperCase() },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Converter datas para string no formato YYYY-MM-DD
    const transactionsWithFixedDates = transactions.map((t: any) => {
      let dateString: string;
      const dateValue = t.date;
      
      if (typeof dateValue === 'string') {
        // Se já é string, extrair apenas YYYY-MM-DD
        dateString = dateValue.includes('T') ? dateValue.split('T')[0] : dateValue;
      } else if (dateValue instanceof Date) {
        // Se é Date, extrair apenas a parte da data usando toISOString
        dateString = dateValue.toISOString().split('T')[0];
      } else {
        dateString = String(dateValue);
      }
      
      return {
        ...t,
        date: dateString
      };
    });

    console.log('🔍 [DEBUG] Primeira transação após conversão:');
    if (transactionsWithFixedDates.length > 0) {
      console.log('  - Descrição:', transactionsWithFixedDates[0].description);
      console.log('  - Data:', transactionsWithFixedDates[0].date);
    }

    return { 
      transactions: transactionsWithFixedDates as any, 
      total, 
      page: Number(page), 
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    };
  }

  async findById(id: string, userId: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });
    
    if (!transaction) {
      throw new NotFoundError('Transação não encontrada');
    }
    
    return transaction;
  }

  async update(id: string, userId: string, data: Partial<Transaction>) {
    const transaction = await this.findById(id, userId);
    
    // Se a data foi alterada, aplicar o mesmo ajuste de timezone
    if (data.date) {
      console.log('📅 [UPDATE DEBUG] Data recebida:', data.date, 'Tipo:', typeof data.date);
      
      let dateObj: Date;
      
      if (typeof data.date === 'string') {
        // Parse da string no formato YYYY-MM-DD ou DD/MM/YYYY
        if (data.date.includes('/')) {
          const [day, month, year] = data.date.split('/').map(Number);
          dateObj = new Date(year, month - 1, day);
        } else {
          const [year, month, day] = data.date.split('-').map(Number);
          dateObj = new Date(year, month - 1, day);
        }
      } else {
        dateObj = new Date(data.date);
      }
      
      console.log('📅 [UPDATE DEBUG] Data antes de ajuste:', dateObj.toISOString());
      
      // ADICIONAR dias conforme configuração de timezone
      const timezoneOffset = parseInt(process.env.TIMEZONE_DATE_OFFSET || '1', 10);
      if (timezoneOffset > 0) {
        dateObj.setDate(dateObj.getDate() + timezoneOffset);
      }
      
      console.log('📅 [UPDATE DEBUG] Data depois de ajuste (+' + timezoneOffset + ' dia):', dateObj.toISOString());
      
      // USAR UTC para evitar problemas de timezone
      const year = dateObj.getUTCFullYear();
      const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getUTCDate()).padStart(2, '0');
      const adjustedDate = `${year}-${month}-${day}`;
      
      console.log('📅 [UPDATE DEBUG] Data final salva:', adjustedDate);
      
      data.date = adjustedDate as any;
    }
    
    Object.assign(transaction, data);
    await this.transactionRepository.save(transaction);
    
    return this.transactionRepository.findOne({
      where: { id: transaction.id },
      relations: ['category'],
    });
  }

  async delete(id: string, userId: string) {
    const transaction = await this.findById(id, userId);
    await this.transactionRepository.remove(transaction);
  }

  async getDashboardData(userId: string, month?: number, year?: number) {
    const now = new Date();
    const targetMonth = month || now.getMonth() + 1;
    const targetYear = year || now.getFullYear();
    
    // Criar strings de data no formato YYYY-MM-DD
    const startOfMonth = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
    const lastDay = new Date(targetYear, targetMonth, 0).getDate();
    const endOfMonth = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    const transactions = await this.transactionRepository.find({
      where: {
        userId,
        date: Between(startOfMonth, endOfMonth),
      },
      relations: ['category'],
      order: { date: 'DESC' },
    });

    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Agrupar por categoria
    const byCategory = transactions.reduce((acc: any, t) => {
      const categoryName = t.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          type: t.type,
          total: 0,
          color: t.category.color,
          icon: t.category.icon,
        };
      }
      acc[categoryName].total += Number(t.amount);
      return acc;
    }, {});

    return {
      summary: {
        income,
        expense,
        balance: income - expense,
        month: targetMonth,
        year: targetYear,
      },
      recentTransactions: transactions.slice(0, 10),
      byCategory: Object.values(byCategory),
    };
  }
}
