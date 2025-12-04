import { subscriptionService } from '../services/subscription.service';

/**
 * Job para expirar planos premium vencidos
 * Deve ser executado diariamente via cron
 */
export async function expirePlansJob(): Promise<void> {
  try {
    console.log('[CRON] Iniciando verificação de planos expirados...');
    
    const expiredCount = await subscriptionService.expireOldPlans();
    
    if (expiredCount > 0) {
      console.log(`[CRON] ${expiredCount} plano(s) premium expirado(s) e convertido(s) para free`);
    } else {
      console.log('[CRON] Nenhum plano expirado encontrado');
    }
  } catch (error) {
    console.error('[CRON] Erro ao expirar planos:', error);
  }
}

/**
 * Configurar execução automática do job
 * Executa todos os dias à meia-noite
 */
export function scheduleExpirePlansJob(): void {
  // Executar imediatamente ao iniciar
  expirePlansJob();

  // Executar a cada 24 horas (86400000 ms)
  setInterval(() => {
    expirePlansJob();
  }, 24 * 60 * 60 * 1000);

  console.log('[CRON] Job de expiração de planos agendado (execução diária)');
}
