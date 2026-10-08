require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function executeMigration() {
  console.log('=== EXECUTANDO MIGRATION: VERIFICATION CODES ===\n');

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
    const sqlFile = path.join(__dirname, 'migrations-sql', '003-create-verification-codes.sql');
    console.log('📄 Lendo arquivo:', sqlFile);
    const sql = fs.readFileSync(sqlFile, 'utf8');
    console.log('✅ Arquivo lido!\n');

    // Executar SQL
    console.log('⚙️  Executando migration...');
    const result = await client.query(sql);
    console.log('✅ Migration executada com sucesso!\n');

    // Verificar tabela criada
    console.log('🔍 Verificando tabela verification_codes...');
    const checkTable = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'verification_codes'
      ORDER BY ordinal_position;
    `);

    if (checkTable.rows.length > 0) {
      console.log('✅ Tabela verification_codes criada com sucesso!\n');
      console.log('📋 Colunas:');
      checkTable.rows.forEach(row => {
        console.log(`   - ${row.column_name} (${row.data_type})`);
      });
    } else {
      console.log('❌ Tabela não encontrada!');
    }

    // Verificar campo emailVerified em users
    console.log('\n🔍 Verificando campo emailVerified em users...');
    const checkField = await client.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'emailVerified';
    `);

    if (checkField.rows.length > 0) {
      console.log('✅ Campo emailVerified adicionado com sucesso!');
      console.log(`   Tipo: ${checkField.rows[0].data_type}`);
      console.log(`   Padrão: ${checkField.rows[0].column_default}`);
    } else {
      console.log('❌ Campo emailVerified não encontrado!');
    }

    console.log('\n=== MIGRATION CONCLUÍDA COM SUCESSO! ===');

  } catch (error) {
    console.error('\n❌ ERRO ao executar migration:');
    console.error(error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Dica: Verifique se o PostgreSQL está rodando');
    } else if (error.code === '42P07') {
      console.log('\n⚠️  Tabela já existe! Migration já foi executada anteriormente.');
    }
    
    process.exit(1);
  } finally {
    await client.end();
  }
}

executeMigration();
