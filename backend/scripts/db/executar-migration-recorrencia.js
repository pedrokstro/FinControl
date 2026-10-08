require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function executeMigration() {
  console.log('=== EXECUTANDO MIGRATION: TRANSAÇÕES RECORRENTES ===\n');

  // Configuração do banco (do .env)
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'fincontrol_db',
  });

  try {
    // Conectar ao banco
    console.log('📡 Conectando ao banco de dados...');
    await client.connect();
    console.log('✅ Conectado!\n');

    // Ler arquivo SQL
    const sqlFile = path.join(__dirname, 'migrations-sql', '004-add-recurring-transactions.sql');
    console.log('📄 Lendo arquivo:', sqlFile);
    const sql = fs.readFileSync(sqlFile, 'utf8');
    console.log('✅ Arquivo lido!\n');

    // Executar SQL
    console.log('⚙️  Executando migration...');
    await client.query(sql);
    console.log('✅ Migration executada com sucesso!\n');

    // Verificar colunas adicionadas
    console.log('🔍 Verificando colunas adicionadas...');
    const checkColumns = await client.query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'transactions'
        AND column_name IN ('isRecurring', 'recurrenceType', 'recurrenceEndDate', 'nextOccurrence', 'parentTransactionId')
      ORDER BY ordinal_position;
    `);

    if (checkColumns.rows.length > 0) {
      console.log('✅ Colunas adicionadas com sucesso!\n');
      console.log('📋 Colunas criadas:');
      checkColumns.rows.forEach(row => {
        console.log(`   - ${row.column_name} (${row.data_type}) ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
      });
    } else {
      console.log('❌ Nenhuma coluna encontrada!');
    }

    // Verificar índices criados
    console.log('\n🔍 Verificando índices criados...');
    const checkIndexes = await client.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'transactions'
        AND indexname LIKE 'idx_transactions_%recurring%'
           OR indexname LIKE 'idx_transactions_%occurrence%'
           OR indexname LIKE 'idx_transactions_%parent%'
      ORDER BY indexname;
    `);

    if (checkIndexes.rows.length > 0) {
      console.log('✅ Índices criados com sucesso!\n');
      console.log('📋 Índices:');
      checkIndexes.rows.forEach(row => {
        console.log(`   - ${row.indexname}`);
      });
    } else {
      console.log('⚠️  Nenhum índice encontrado (pode já existir)');
    }

    console.log('\n=== MIGRATION CONCLUÍDA COM SUCESSO! ===');
    console.log('\n💡 Próximo passo: Reinicie o backend com "npm run dev"');

  } catch (error) {
    console.error('\n❌ ERRO ao executar migration:');
    console.error(error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Dica: Verifique se o PostgreSQL está rodando');
    } else if (error.code === '42701') {
      console.log('\n⚠️  Colunas já existem! Migration já foi executada anteriormente.');
    } else if (error.code === '42P07') {
      console.log('\n⚠️  Índices já existem! Migration já foi executada anteriormente.');
    }
    
    process.exit(1);
  } finally {
    await client.end();
  }
}

executeMigration();
