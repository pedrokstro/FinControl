import { AppDataSource } from '@/config/database';
import { Transaction, RecurrenceType } from '@/models/Transaction';
import { logger } from '@/utils/logger';
import { LessThanOrEqual } from 'typeorm';

class RecurrenceService {
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
          if (!transaction.nextOccurrence) {
            logger.info(`⏸️  Recurring transaction ${transaction.id} has no next occurrence defined, skipping`);
            transaction.isRecurring = false;
            await this.transactionRepository.save(transaction);
            continue;
          }

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
    recurrenceEndDate?: Date,
    recurrenceMonths: number = 1
  ): Promise<Transaction[]> {
    console.log('🔄 [DEBUG] Data recebida (recorrente):', transactionData.date, 'Tipo:', typeof transactionData.date);

    const baseDate = this.parseInputDate(transactionData.date as any);
    const totalMonths = Math.max(1, recurrenceMonths || 1);

    const finalEndDate =
      recurrenceEndDate ??
      this.addMonths(baseDate, totalMonths > 0 ? totalMonths - 1 : 0);

    const amount =
      typeof transactionData.amount === 'string'
        ? parseFloat(transactionData.amount)
        : transactionData.amount;

    if (!transactionData.type || !transactionData.categoryId || !transactionData.userId || amount === undefined) {
      throw new Error('Missing data to create recurring transaction');
    }

    const parentEntity = this.transactionRepository.create({
      type: transactionData.type,
      amount,
      description: transactionData.description || '',
      date: this.applyStorageOffset(baseDate),
      categoryId: transactionData.categoryId,
      userId: transactionData.userId,
      isRecurring: true,
      recurrenceType,
      recurrenceEndDate: finalEndDate || null,
      nextOccurrence: null,
    });

    const savedParent = await this.transactionRepository.save(parentEntity);
    logger.info(`✅ Created recurring transaction ${savedParent.id} (${recurrenceType})`);

    const transactionsWithRelations: Transaction[] = [];
    const parentWithRelations = await this.transactionRepository.findOne({
      where: { id: savedParent.id },
      relations: ['category'],
    });

    if (parentWithRelations) {
      transactionsWithRelations.push(parentWithRelations);
    }

    for (let installment = 1; installment < totalMonths; installment++) {
      const occurrenceDate = this.addMonths(baseDate, installment);
      const childEntity = this.transactionRepository.create({
        type: transactionData.type,
        amount,
        description: transactionData.description || '',
        date: this.applyStorageOffset(occurrenceDate),
        categoryId: transactionData.categoryId,
        userId: transactionData.userId,
        isRecurring: false,
        parentTransactionId: savedParent.id,
      });

      const savedChild = await this.transactionRepository.save(childEntity);
      const childWithRelations = await this.transactionRepository.findOne({
        where: { id: savedChild.id },
        relations: ['category'],
      });

      if (childWithRelations) {
        transactionsWithRelations.push(childWithRelations);
      }
    }

    return transactionsWithRelations;
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

  private parseInputDate(value: any): Date {
    if (!value) {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }

    if (typeof value === 'string') {
      const [year, month, day] = value.split('-').map(Number);
      return new Date(year, month - 1, day);
    }

    if (value instanceof Date) {
      return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    }

    const dateValue = new Date(value);
    return new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate());
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private applyStorageOffset(date: Date): string {
    const adjusted = new Date(date);
    adjusted.setDate(adjusted.getDate() + 2);
    return this.formatDate(adjusted);
  }

  private addMonths(date: Date, months: number): Date {
    const copy = new Date(date);
    copy.setMonth(copy.getMonth() + months);
    return copy;
  }
}

export default new RecurrenceService();
