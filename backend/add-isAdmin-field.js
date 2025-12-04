const { Client } = require('pg');

async function addIsAdminField() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'fincontrol_db',
    user: 'postgres',
    password: '360106'
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
