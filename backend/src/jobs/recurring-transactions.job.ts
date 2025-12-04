import cron from 'node-cron';
import recurrenceService from '@/services/recurrence.service';
import { logger } from '@/utils/logger';

/**
 * Job para processar transações recorrentes
 * Executa todos os dias às 00:05 (5 minutos após meia-noite)
 */
export const scheduleRecurringTransactionsJob = () => {
  // Executar todos os dias às 00:05
  cron.schedule('5 0 * * *', async () => {
    try {
      logger.info('🔄 Starting recurring transactions job...');
      const processed = await recurrenceService.processRecurringTransactions();
      logger.info(`✅ Recurring transactions job completed. Processed: ${processed}`);
    } catch (error) {
      logger.error('❌ Error in recurring transactions job:', error);
    }
  });

  logger.info('⏰ Recurring transactions job scheduled (daily at 00:05)');
};

/**
 * Processar transações recorrentes manualmente (para testes)
 */
export const processRecurringTransactionsNow = async () => {
  try {
    logger.info('🔄 Processing recurring transactions manually...');
    const processed = await recurrenceService.processRecurringTransactions();
    logger.info(`✅ Manual processing completed. Processed: ${processed}`);
    return processed;
  } catch (error) {
    logger.error('❌ Error in manual processing:', error);
    throw error;
  }
};
