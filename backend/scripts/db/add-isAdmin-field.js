require('dotenv').config();
const { Client } = require('pg');

async function addIsAdminField() {
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

    await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN DEFAULT FALSE');
    console.log('✅ Campo isAdmin adicionado à tabela users');

    await client.query('CREATE INDEX IF NOT EXISTS idx_users_isAdmin ON users("isAdmin")');
    console.log('✅ Índice criado para isAdmin\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

addIsAdminField();
