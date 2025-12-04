import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { logger } from '../utils/logger';

/**
 * Script para executar migration de campos premium
 */
async function runMigration() {
  try {
    logger.info('🔄 Iniciando migration...');

    // Inicializar conexão com banco
    await AppDataSource.initialize();
    logger.info('✅ Conexão com banco estabelecida');

    // Executar migration manualmente
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Verificar se colunas já existem
      const table = await queryRunner.getTable('users');
      const hasPlanType = table?.columns.find(col => col.name === 'planType');

      if (hasPlanType) {
        logger.info('⚠️  Colunas de plano premium já existem. Migration não necessária.');
        return;
      }

      logger.info('📝 Adicionando colunas de plano premium...');

      // Adicionar coluna planType
      await queryRunner.query(`
        ALTER TABLE users 
        ADD COLUMN "planType" VARCHAR(20) DEFAULT 'free'
      `);
      logger.info('✅ Coluna planType adicionada');

      // Adicionar coluna planStartDate
      await queryRunner.query(`
        ALTER TABLE users 
        ADD COLUMN "planStartDate" TIMESTAMP NULL
      `);
      logger.info('✅ Coluna planStartDate adicionada');

      // Adicionar coluna planEndDate
      await queryRunner.query(`
        ALTER TABLE users 
        ADD COLUMN "planEndDate" TIMESTAMP NULL
      `);
      logger.info('✅ Coluna planEndDate adicionada');

      // Adicionar coluna isPremium
      await queryRunner.query(`
        ALTER TABLE users 
        ADD COLUMN "isPremium" BOOLEAN DEFAULT false
      `);
      logger.info('✅ Coluna isPremium adicionada');

      logger.info('🎉 Migration concluída com sucesso!');
    } finally {
      await queryRunner.release();
    }
  } catch (error) {
    logger.error('❌ Erro ao executar migration:', error);
    throw error;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      logger.info('🔌 Conexão com banco encerrada');
    }
  }
}

// Executar migration
runMigration()
  .then(() => {
    logger.info('✅ Script de migration finalizado');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('❌ Falha na migration:', error);
    process.exit(1);
  });
