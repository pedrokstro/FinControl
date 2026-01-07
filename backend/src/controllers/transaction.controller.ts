import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '@/services/transaction.service';
import recurrenceService from '@/services/recurrence.service';
import smartNotificationService from '@/services/smartNotification.service';
import { sendSuccess, sendCreated, sendPaginated } from '@/utils/response';

const transactionService = new TransactionService();

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const {
      isRecurring,
      recurrenceType,
      recurrenceEndDate,
      recurrenceMonths,
      totalInstallments,
      ...transactionData
    } = req.body;

    let transaction;

    if (isRecurring && recurrenceType) {
      // Criar transação recorrente
      transaction = await recurrenceService.createRecurringTransaction(
        { ...transactionData, userId },
        recurrenceType,
        recurrenceEndDate ? new Date(recurrenceEndDate) : undefined,
        recurrenceMonths,
        totalInstallments
      );
    } else {
      // Criar transação normal
      transaction = await transactionService.create(userId, transactionData);
    }

    // Enviar notificações inteligentes (não aguardar para não travar)
    // Se for array (recorrente), pegar o primeiro. Se for objeto único, usar direto.
    const transactionToNotify = Array.isArray(transaction) ? transaction[0] : transaction;
    if (transactionToNotify) {
      smartNotificationService.analyzeTransaction(userId, transactionToNotify)
        .catch(err => console.error('Erro ao enviar notificações:', err));
    }

    sendCreated(res, transaction, 'Transação criada com sucesso');
  } catch (error) {
    next(error);
  }
};

export const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const filters = req.query;
    const result = await transactionService.findAll(userId, filters);

    sendPaginated(
      res,
      result.transactions,
      result.total,
      result.page,
      result.limit,
      'Transações obtidas com sucesso'
    );
  } catch (error) {
    next(error);
  }
};

export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const transaction = await transactionService.findById(id, userId);
    sendSuccess(res, transaction, 'Transação obtida com sucesso');
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const data = req.body;
    const transaction = await transactionService.update(id, userId, data);
    sendSuccess(res, transaction, 'Transação atualizada com sucesso');
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    await transactionService.delete(id, userId);
    sendSuccess(res, null, 'Transação deletada com sucesso');
  } catch (error) {
    next(error);
  }
};

// Cancelar recorrência de uma transação
export const cancelRecurrence = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const transaction = await recurrenceService.cancelRecurrence(id);
    sendSuccess(res, transaction, 'Recorrência cancelada com sucesso');
  } catch (error) {
    next(error);
  }
};

// Obter transações geradas por uma transação recorrente
export const getGeneratedTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const transactions = await recurrenceService.getGeneratedTransactions(id);
    sendSuccess(res, transactions, 'Transações geradas obtidas com sucesso');
  } catch (error) {
    next(error);
  }
};
