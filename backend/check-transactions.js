const mysql = require('mysql2/promise');

async function checkTransactions() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'fincontrol_db'
    });
    
    const [rows] = await conn.query('SELECT id, description, date, amount, type FROM transactions ORDER BY date DESC');
    
    console.log('📊 Transações no banco:');
    rows.forEach(t => {
      console.log(`  ${t.date} | ${t.description} | R$ ${t.amount} (${t.type})`);
    });
    
    await conn.end();
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

checkTransactions();
