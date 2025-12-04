import { AppDataSource } from '@/config/database';
import { Transaction, RecurrenceType } from '@/models/Transaction';
import { logger } from '@/utils/logger';
import { LessThanOrEqual } from 'typeorm';

export class RecurrenceService {
  private transactionRepository = AppDataSource.getRepository(Transaction);

  /**
   * Calcular próxima ocorrência baseada no tipo de recorrência
   */
  calculateNextOccurrence(currentDate: Date, recurrenceType: RecurrenceType): Date {
    const nextDate = new Date(currentDate);

    switch (recurrenceType) {
      case RecurrenceType.DAILY:
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case RecurrenceType.WEEKLY:
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case RecurrenceType.MONTHLY:
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case RecurrenceType.YEARLY:
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }

    return nextDate;
  }

  /**
   * Processar transações recorrentes que devem ser geradas
   */
  async processRecurringTransactions(): Promise<number> {
    try {
      const now = new Date();
      let processedCount = 0;

      // Buscar transações recorrentes que precisam gerar nova ocorrência
      const recurringTransactions = await this.transactionRepository.find({
        where: {
          isRecurring: true,
          nextOccurrence: LessThanOrEqual(now),
        },
      });

      logger.info(`📅 Found ${recurringTransactions.length} recurring transactions to process`);

      for (const transaction of recurringTransactions) {
        try {
          // Verificar se ainda está dentro do período de recorrência
          if (transaction.recurrenceEndDate && new Date(transaction.recurrenceEndDate) < now) {
            logger.info(`⏹️  Recurring transaction ${transaction.id} has ended, skipping`);
            
            // Desativar recorrência
            transaction.isRecurring = false;
            transaction.nextOccurrence = null;
            await this.transactionRepository.save(transaction);
            continue;
          }

          // Criar nova transação baseada na recorrente
          const nextDate = new Date(transaction.nextOccurrence!);
          const dateString = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;
          
          const newTransaction = this.transactionRepository.create({
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            date: dateString,
            categoryId: transaction.categoryId,
            userId: transaction.userId,
            isRecurring: false, // Transações geradas não são recorrentes
            parentTransactionId: transaction.id,
          });

          await this.transactionRepository.save(newTransaction);
          logger.info(`✅ Created new transaction from recurring ${transaction.id}`);

          // Atualizar próxima ocorrência
          transaction.nextOccurrence = this.calculateNextOccurrence(
            transaction.nextOccurrence!,
            transaction.recurrenceType!
          );
          await this.transactionRepository.save(transaction);

          processedCount++;
        } catch (error) {
          logger.error(`❌ Error processing recurring transaction ${transaction.id}:`, error);
        }
      }

      logger.info(`🎉 Processed ${processedCount} recurring transactions`);
      return processedCount;
    } catch (error) {
      logger.error('❌ Error in processRecurringTransactions:', error);
      throw error;
    }
  }

  /**
   * Criar transação recorrente
   */
  async createRecurringTransaction(
    transactionData: Partial<Transaction>,
    recurrenceType: RecurrenceType,
    recurrenceEndDate?: Date
  ): Promise<Transaction> {
    // Log para debug
    console.log('🔄 [DEBUG] Data recebida (recorrente):', transactionData.date, 'Tipo:', typeof transactionData.date);
    
    // ADICIONAR 2 DIAS para compensar o timezone do PostgreSQL
    let transactionDate: string;
    let firstOccurrenceForCalc: Date;
    
    if (transactionData.date) {
      const dateValue = transactionData.date as any;
      if (typeof dateValue === 'string') {
        // Adicionar 2 dias à data
        const [year, month, day] = dateValue.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        dateObj.setDate(dateObj.getDate() + 2); // ADICIONAR 2 DIAS
        
        const newYear = dateObj.getFullYear();
        const newMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
        const newDay = String(dateObj.getDate()).padStart(2, '0');
        transactionDate = `${newYear}-${newMonth}-${newDay}`;
        
        // Usar data original para calcular nextOccurrence
        firstOccurrenceForCalc = new Date(year, month - 1, day);
        
        console.log('🔄 [DEBUG] Data original:', dateValue);
        console.log('🔄 [DEBUG] Data +2 dias:', transactionDate);
      } else {
        const dateObj = new Date(dateValue);
        firstOccurrenceForCalc = new Date(dateValue);
        
        dateObj.setDate(dateObj.getDate() + 2); // ADICIONAR 2 DIAS
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        transactionDate = `${year}-${month}-${day}`;
      }
    } else {
      const today = new Date();
      firstOccurrenceForCalc = new Date(today);
      
      today.setDate(today.getDate() + 2); // ADICIONAR 2 DIAS
      transactionDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }
    
    const nextOccurrence = this.calculateNextOccurrence(firstOccurrenceForCalc, recurrenceType);

    // Usar query SQL direta para garantir que a data seja salva corretamente
    const result = await this.transactionRepository.query(
      `INSERT INTO transactions (type, amount, description, date, "categoryId", "userId", "isRecurring", "recurrenceType", "recurrenceEndDate", "nextOccurrence")
       VALUES ($1, $2, $3, $4::date, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        transactionData.type,
        transactionData.amount,
        transactionData.description,
        transactionDate, // String no formato YYYY-MM-DD
        transactionData.categoryId,
        transactionData.userId,
        true, // isRecurring
        recurrenceType,
        recurrenceEndDate || null,
        nextOccurrence
      ]
    );
    
    const transactionId = result[0].id;
    logger.info(`✅ Created recurring transaction ${transactionId} (${recurrenceType})`);

    // Buscar a transação criada com as relações
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: ['category'],
    });

    return transaction!;
  }

  /**
   * Atualizar transação recorrente
   */
  async updateRecurringTransaction(
    transactionId: string,
    updates: Partial<Transaction>
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Se mudou o tipo de recorrência, recalcular próxima ocorrência
    if (updates.recurrenceType && updates.recurrenceType !== transaction.recurrenceType) {
      const currentNext = transaction.nextOccurrence || new Date();
      updates.nextOccurrence = this.calculateNextOccurrence(currentNext, updates.recurrenceType);
    }

    Object.assign(transaction, updates);
    await this.transactionRepository.save(transaction);

    return transaction;
  }

  /**
   * Cancelar recorrência de uma transação
   */
  async cancelRecurrence(transactionId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    transaction.isRecurring = false;
    transaction.nextOccurrence = null;
    await this.transactionRepository.save(transaction);

    logger.info(`⏹️  Cancelled recurrence for transaction ${transactionId}`);
    return transaction;
  }

  /**
   * Obter transações geradas por uma transação recorrente
   */
  async getGeneratedTransactions(parentTransactionId: string): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: { parentTransactionId },
      order: { date: 'DESC' },
    });
  }
}

export default new RecurrenceService();
