import 'reflect-metadata';
import { initializeDatabase } from '../config/database';
import recurrenceService from '../services/recurrence.service';
import { logger } from '../utils/logger';

async function main() {
  try {
    logger.info('🔄 Iniciando processamento manual de transações recorrentes...');
    await initializeDatabase();
    const processed = await recurrenceService.processRecurringTransactions();
    logger.info(`✅ Processamento manual concluído. Transações geradas: ${processed}`);
    process.exit(0);
  } catch (error) {
    logger.error('❌ Erro ao processar transações recorrentes manualmente', error);
    process.exit(1);
  }
}

main();
