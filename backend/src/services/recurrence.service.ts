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
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const now = new Date();
      let processedCount = 0;

      // Buscar transações recorrentes usando PESSIMISTIC LOCK (Evita Race Condition no Cron Job)
      const recurringTransactions = await queryRunner.manager.find(Transaction, {
        where: {
          isRecurring: true,
          nextOccurrence: LessThanOrEqual(now),
        },
        lock: { mode: "pessimistic_write", onLocked: "skip_locked" },
      });

      logger.info(`📅 Found ${recurringTransactions.length} recurring transactions to process`);

      for (const transaction of recurringTransactions) {
        try {
          if (!transaction.nextOccurrence) {
            logger.info(`⏸️  Recurring transaction ${transaction.id} has no next occurrence defined, skipping`);
            transaction.isRecurring = false;
            await queryRunner.manager.save(Transaction, transaction);
            continue;
          }

          // Verificar se foi cancelada manualmente (modo infinito)
          if (transaction.isCancelled) {
            logger.info(`❌ Recurring transaction ${transaction.id} was cancelled by user`);
            transaction.isRecurring = false;
            transaction.nextOccurrence = null;
            await queryRunner.manager.save(Transaction, transaction);
            continue;
          }

          // MODO 1: Verificar se atingiu limite de parcelas
          if (transaction.totalInstallments && transaction.currentInstallment) {
            if (transaction.currentInstallment >= transaction.totalInstallments) {
              logger.info(`✅ Recurring transaction ${transaction.id} completed all ${transaction.totalInstallments} installments`);
              transaction.isRecurring = false;
              transaction.nextOccurrence = null;
              await queryRunner.manager.save(Transaction, transaction);
              continue;
            }
          }

          // MODO 2: Verificar se ainda está dentro do período de recorrência (data fim)
          if (transaction.recurrenceEndDate && new Date(transaction.recurrenceEndDate) < now) {
            logger.info(`⏹️  Recurring transaction ${transaction.id} has ended (recurrenceEndDate)`);
            transaction.isRecurring = false;
            transaction.nextOccurrence = null;
            await queryRunner.manager.save(Transaction, transaction);
            continue;
          }

          // Criar nova transação baseada na recorrente
          const nextDate = new Date(transaction.nextOccurrence!);
          const dateString = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;

          const currentInstallment = (transaction.currentInstallment || 0) + 1;

          const newTransaction = queryRunner.manager.create(Transaction, {
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            date: dateString,
            categoryId: transaction.categoryId,
            userId: transaction.userId,
            isRecurring: false,
            parentTransactionId: transaction.id,
            currentInstallment,
            totalInstallments: transaction.totalInstallments,
            creditCardId: transaction.creditCardId,
          });

          await queryRunner.manager.save(Transaction, newTransaction);

          const installmentInfo = transaction.totalInstallments
            ? `${currentInstallment}/${transaction.totalInstallments}`
            : 'infinito';
          logger.info(`✅ Created installment ${installmentInfo} from recurring ${transaction.id}`);

          // Atualizar próxima ocorrência e contador de parcelas
          transaction.currentInstallment = currentInstallment;
          transaction.nextOccurrence = this.calculateNextOccurrence(
            transaction.nextOccurrence!,
            transaction.recurrenceType!
          );
          await queryRunner.manager.save(Transaction, transaction);

          processedCount++;
        } catch (error) {
          logger.error(`❌ Error processing recurring transaction ${transaction.id}:`, error);
        }
      }

      await queryRunner.commitTransaction();
      logger.info(`🎉 Processed ${processedCount} recurring transactions`);
      return processedCount;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('❌ Error in processRecurringTransactions:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Criar transação recorrente
   */
  async createRecurringTransaction(
    transactionData: Partial<Transaction>,
    recurrenceType: RecurrenceType,
    recurrenceEndDate?: Date,
    recurrenceMonths: number = 1,
    totalInstallments?: number
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

    const installmentsLimit =
      totalInstallments ??
      transactionData.totalInstallments ??
      (recurrenceMonths > 1 ? recurrenceMonths : undefined);

    const nextOccurrenceDate = this.calculateNextOccurrence(baseDate, recurrenceType);

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
      nextOccurrence: nextOccurrenceDate,
      currentInstallment: transactionData.currentInstallment ?? 1,
      totalInstallments: installmentsLimit ?? null,
      creditCardId: transactionData.creditCardId || null,
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

    // ATENÇÃO: Alteração solicitada pelo usuário.
    // Não criar parcelas futuras antecipadamente. Deixar o Job processar mês a mês.
    // O loop for abaixo foi removido para evitar criação de dados futuros no banco.

    /*
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
    */

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

    if (!transaction.isRecurring) {
      throw new Error('Transaction is not recurring');
    }

    // Marcar como cancelada (para histórico)
    transaction.isCancelled = true;
    transaction.cancelledAt = new Date();
    transaction.isRecurring = false;
    transaction.nextOccurrence = null;

    await this.transactionRepository.save(transaction);

    logger.info(`❌ Cancelled recurrence for transaction ${transactionId}`);
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
