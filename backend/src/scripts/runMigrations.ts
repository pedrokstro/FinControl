import { AppDataSource } from '../config/database';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runMigrations() {
  const maxRetries = 1; // Reduzir para 1 tentativa para evitar múltiplas conexões
  let attempt = 0;

  // Aguardar 3 segundos antes de tentar conectar (dar tempo para o Supabase estar pronto)
  console.log('⏳ Aguardando 3s antes de conectar ao banco...');
  await sleep(3000);

  while (attempt < maxRetries) {
    try {
      attempt++;
      console.log(`🔄 Tentativa ${attempt}/${maxRetries} - Conectando ao banco de dados...`);
      const opts = AppDataSource.options as any;
      console.log('📊 Configuração:', {
        host: opts.host || 'from URL',
        port: opts.port || 'from URL',
        database: opts.database || 'from URL',
      });
      
      await AppDataSource.initialize();
      console.log('✅ Conexão estabelecida com sucesso!');
      
      console.log('🔄 Executando migrations...');
      const migrations = await AppDataSource.runMigrations();
      
      if (migrations.length === 0) {
        console.log('✅ Nenhuma migration pendente');
      } else {
        console.log(`✅ ${migrations.length} migration(s) executada(s):`);
        migrations.forEach(migration => {
          console.log(`   - ${migration.name}`);
        });
      }
      
      await AppDataSource.destroy();
      console.log('✅ Migrations concluídas com sucesso!');
      process.exit(0);
    } catch (error) {
      console.error(`❌ Erro na tentativa ${attempt}:`, error);
      
      if (attempt < maxRetries) {
        const waitTime = attempt * 5000; // 5s, 10s, 15s
        console.log(`⏳ Aguardando ${waitTime/1000}s antes de tentar novamente...`);
        await sleep(waitTime);
      } else {
        console.error('❌ Todas as tentativas falharam');
        process.exit(1);
      }
    }
  }
}

runMigrations();
