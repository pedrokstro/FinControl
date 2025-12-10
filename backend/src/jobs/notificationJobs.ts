import cron from 'node-cron';
import { AppDataSource } from '@/config/database';
import smartNotificationService from '@/services/smartNotification.service';

/**
 * Jobs agendados para notificações automáticas
 */

/**
 * Enviar dicas diárias para todos os usuários
 * Executa todo dia às 9h
 */
export const dailyTipsJob = cron.schedule('0 9 * * *', async () => {
  console.log('🔔 Executando job de dicas diárias...');
  
  try {
    // Buscar todos os usuários ativos
    const users = await AppDataSource.manager.query(
      'SELECT id FROM users WHERE "isActive" = true LIMIT 100'
    );

    for (const user of users) {
      try {
        await smartNotificationService.sendSavingsTips(user.id);
      } catch (error) {
        console.error(`Erro ao enviar dica para usuário ${user.id}:`, error);
      }
    }

    console.log(`✅ Dicas enviadas para ${users.length} usuários`);
  } catch (error) {
    console.error('❌ Erro no job de dicas diárias:', error);
  }
}, {
  scheduled: false, // Não iniciar automaticamente
  timezone: 'America/Sao_Paulo'
});

/**
 * Enviar dicas sobre funcionalidades
 * Executa a cada 3 dias às 14h
 */
export const featureTipsJob = cron.schedule('0 14 */3 * *', async () => {
  console.log('🔔 Executando job de dicas de funcionalidades...');
  
  try {
    // Buscar usuários que criaram conta nos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const users = await AppDataSource.manager.query(
      'SELECT id FROM users WHERE "isActive" = true AND "createdAt" >= $1 LIMIT 50',
      [thirtyDaysAgo]
    );

    for (const user of users) {
      try {
        await smartNotificationService.sendFeatureTips(user.id);
      } catch (error) {
        console.error(`Erro ao enviar dica de funcionalidade para usuário ${user.id}:`, error);
      }
    }

    console.log(`✅ Dicas de funcionalidades enviadas para ${users.length} usuários`);
  } catch (error) {
    console.error('❌ Erro no job de dicas de funcionalidades:', error);
  }
}, {
  scheduled: false,
  timezone: 'America/Sao_Paulo'
});

/**
 * Enviar análise semanal
 * Executa toda segunda-feira às 10h
 */
export const weeklyAnalysisJob = cron.schedule('0 10 * * 1', async () => {
  console.log('🔔 Executando job de análise semanal...');
  
  try {
    // Buscar usuários que tiveram transações na última semana
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const users = await AppDataSource.manager.query(
      `SELECT DISTINCT "userId" as id 
       FROM transactions 
       WHERE CAST(date AS DATE) >= $1`,
      [weekAgo]
    );

    for (const user of users) {
      try {
        await smartNotificationService.sendWeeklyAnalysis(user.id);
      } catch (error) {
        console.error(`Erro ao enviar análise semanal para usuário ${user.id}:`, error);
      }
    }

    console.log(`✅ Análises semanais enviadas para ${users.length} usuários`);
  } catch (error) {
    console.error('❌ Erro no job de análise semanal:', error);
  }
}, {
  scheduled: false,
  timezone: 'America/Sao_Paulo'
});

/**
 * Iniciar todos os jobs
 */
export const startNotificationJobs = () => {
  console.log('🚀 Iniciando jobs de notificações...');
  
  dailyTipsJob.start();
  console.log('✅ Job de dicas diárias iniciado (9h)');
  
  featureTipsJob.start();
  console.log('✅ Job de dicas de funcionalidades iniciado (14h a cada 3 dias)');
  
  weeklyAnalysisJob.start();
  console.log('✅ Job de análise semanal iniciado (segunda-feira 10h)');
};

/**
 * Parar todos os jobs
 */
export const stopNotificationJobs = () => {
  dailyTipsJob.stop();
  featureTipsJob.stop();
  weeklyAnalysisJob.stop();
  console.log('🛑 Jobs de notificações parados');
};
