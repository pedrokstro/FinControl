const mysql = require('mysql2/promise');

async function checkTables() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'fincontrol_db'
    });
    
    console.log('✅ Conectado ao banco de dados\n');
    
    // Verificar estrutura da tabela transactions
    const [columns] = await connection.query('DESCRIBE transactions');
    
    console.log('📋 Colunas da tabela transactions:');
    columns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkTables();
