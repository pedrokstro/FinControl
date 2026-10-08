require('dotenv').config();
const { Client } = require('pg');

async function checkDates() {
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

    // Buscar todas as transações com suas datas
    const result = await client.query(`
      SELECT id, description, date, date::text as date_text
      FROM transactions 
      ORDER BY date DESC
    `);
    
    console.log('📊 Transações no banco:\n');
    result.rows.forEach(row => {
      console.log(`- ${row.description}: ${row.date_text} (raw: ${row.date})`);
    });

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

checkDates();
