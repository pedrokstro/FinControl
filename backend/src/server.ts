import app from './app';
import { config } from '@/config/env';
import { initializeDatabase } from '@/config/database';
import { logger } from '@/utils/logger';
import { scheduleExpirePlansJob } from '@/jobs/expirePlans.job';
import fs from 'fs';
import path from 'path';

/**
 * Cria diretórios necessários
 */
const createDirectories = () => {
  const dirs = [
    config.upload.dir,
    path.join(config.upload.dir, 'avatars'),
    config.logging.dir,
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`📁 Directory created: ${dir}`);
    }
  });
};

/**
 * Inicia o servidor
 */
const startServer = async (): Promise<void> => {
  try {
    // Criar diretórios necessários
    createDirectories();

    // Inicializar banco de dados
    await initializeDatabase();

    // Executar seeders (opcional - apenas em desenvolvimento)
    // ⚠️ DESABILITADO PARA TESTES - Remova o comentário para reativar
    // if (config.nodeEnv === 'development') {
    //   const { runSeeders } = await import('./database/seeders');
    //   await runSeeders();
    // }

    // Iniciar job de expiração de planos premium
    scheduleExpirePlansJob();
    logger.info('⏰ Premium plan expiration job scheduled');

    // Iniciar job de transações recorrentes
    try {
      const { scheduleRecurringTransactionsJob, processRecurringTransactionsNow } = await import('./jobs/recurring-transactions.job');
      scheduleRecurringTransactionsJob();
      logger.info('⏰ Recurring transactions job scheduled');

      // Processar imediatamente pendências retroativas (caso o servidor estivesse inativo no horário programado)
      processRecurringTransactionsNow()
        .then((count) => {
          if (count > 0) {
            logger.info(`✅ Startup catch-up: ${count} transações recorrentes pendentes foram processadas.`);
          } else {
            logger.info('ℹ️ Startup catch-up: Nenhuma transação recorrente pendente.');
          }
        })
        .catch((error) => {
          logger.error('❌ Falha ao processar pendências retroativas de recorrência na inicialização:', error);
        });
    } catch (error) {
      logger.error('❌ Failed to load recurring transactions job:', error);
    }

    // Iniciar jobs de notificações inteligentes
    const { startNotificationJobs } = await import('./jobs/notificationJobs');
    startNotificationJobs();
    logger.info('⏰ Smart notification jobs scheduled');

    // Iniciar servidor HTTP
    const server = app.listen(config.port, () => {
      logger.info('='.repeat(50));
      logger.info('🚀 FinControl API Server Started');
      logger.info('='.repeat(50));
      logger.info(`📡 Port: ${config.port}`);
      logger.info(`🌍 Environment: ${config.nodeEnv}`);
      logger.info(`🏥 Health: http://localhost:${config.port}/health`);
      logger.info(`📚 API Docs: http://localhost:${config.port}/api-docs`);
      logger.info(`🔗 API Base: http://localhost:${config.port}${config.apiPrefix}`);
      logger.info('='.repeat(50));
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();
