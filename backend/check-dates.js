const { Client } = require('pg');

async function checkDates() {
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
