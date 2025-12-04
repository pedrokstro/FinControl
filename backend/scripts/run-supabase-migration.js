const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// IMPORTANTE: Substitua pelo seu host real do Supabase
// Você pode encontrar em: Supabase Dashboard > Settings > Database > Connection string
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:360106@db.hzazlkgpamawlqmvxyii.supabase.co:5432/postgres';

async function runMigration() {
  console.log('📋 Informações de Conexão:');
  console.log('   Host: db.hzazlkgpamawlqmvxyii.supabase.co');
  console.log('   Porta: 5432');
  console.log('   Database: postgres');
  console.log('   User: postgres\n');

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log('🔌 Conectando ao Supabase...');
    await client.connect();
    console.log('✅ Conectado com sucesso!\n');

    // Ler o arquivo SQL
    const sqlFile = path.join(__dirname, '../database/postgresql/add-trial-and-googlepay.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('📝 Executando migration...\n');
    
    // Dividir em comandos individuais e executar
    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    for (const command of commands) {
      if (command.includes('SELECT')) {
        const result = await client.query(command);
        if (result.rows.length > 0) {
          console.log('📊 Resultado:', result.rows);
        }
      } else {
        await client.query(command);
        console.log('✅ Comando executado');
      }
    }

    console.log('\n🎉 Migration executada com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao executar migration:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Conexão fechada');
  }
}

runMigration();
