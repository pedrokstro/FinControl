-- ==============================================================================
-- Job de Keep-Alive para Render Free Tier no Supabase (pg_cron + pg_net)
-- Mantém a instância do backend ativa a cada 14 minutos evitando a suspensão
-- por inatividade (sleep após 15 minutos de inatividade HTTP).
-- ==============================================================================

-- 1. Habilitar as extensões necessárias
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Desagendar job antigo se já existir (evita duplicatas)
SELECT cron.unschedule(jobid) 
FROM cron.job 
WHERE jobname = 'keep_render_backend_alive';

-- 3. Agendar ping HTTP GET para o health check da API a cada 14 minutos
SELECT cron.schedule(
  'keep_render_backend_alive',
  '*/14 * * * *',
  $$SELECT net.http_get(
      url := 'https://fincontrol-735h.onrender.com/health',
      timeout_milliseconds := 60000
  );$$
);

-- 4. Consulta para verificar o status do job
-- SELECT jobid, schedule, command, active, jobname FROM cron.job WHERE jobname = 'keep_render_backend_alive';
-- SELECT * FROM net._http_response ORDER BY created DESC LIMIT 5;
