require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'fincontrol_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados\n');

    // Ler arquivo SQL
    const sqlPath = path.join(__dirname, 'migrations-sql', '005-add-notifications.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📝 Executando migration de notificações...\n');

    // Executar migration
    await client.query(sql);

    console.log('✅ Migration executada com sucesso!');
    console.log('📊 Tabela "notifications" criada');
    console.log('🔔 Sistema de notificações pronto para uso!\n');

  } catch (error) {
    console.error('❌ Erro ao executar migration:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
