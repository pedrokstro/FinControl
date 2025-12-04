import { AppDataSource } from '../config/database';

async function runMigrations() {
  try {
    console.log('🔄 Conectando ao banco de dados...');
    await AppDataSource.initialize();
    
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
    console.error('❌ Erro ao executar migrations:', error);
    process.exit(1);
  }
}

runMigrations();
