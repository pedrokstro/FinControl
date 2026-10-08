require('dotenv').config();
const { Client } = require('pg');

async function fixDates() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'fincontrol_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados');

    // Buscar todas as transações
    const result = await client.query('SELECT id, date, description FROM transactions ORDER BY date DESC');
    console.log(`📊 Total de transações: ${result.rows.length}`);

    // Corrigir cada transação adicionando 2 dias
    for (const row of result.rows) {
      const currentDate = new Date(row.date);
      const fixedDate = new Date(currentDate);
      fixedDate.setDate(fixedDate.getDate() + 2);
      
      const fixedDateString = fixedDate.toISOString().split('T')[0];
      
      await client.query(
        'UPDATE transactions SET date = $1 WHERE id = $2',
        [fixedDateString, row.id]
      );
      
      console.log(`✅ ${row.description}: ${row.date} -> ${fixedDateString}`);
    }

    console.log('✅ Todas as datas foram corrigidas!');
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
  }
}

fixDates();
