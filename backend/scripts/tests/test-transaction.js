const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

async function testTransaction() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'fincontrol_db'
    });
    
    console.log('✅ Conectado ao banco\n');
    
    // Buscar usuário
    const [users] = await connection.query('SELECT id FROM users LIMIT 1');
    if (users.length === 0) {
      console.log('❌ Nenhum usuário encontrado');
      return;
    }
    const userId = users[0].id;
    console.log('👤 Usuário:', userId);
    
    // Buscar categoria
    const [categories] = await connection.query('SELECT id, name, type FROM categories WHERE userId = ?', [userId]);
    if (categories.length === 0) {
      console.log('❌ Nenhuma categoria encontrada');
      return;
    }
    console.log('\n📁 Categorias disponíveis:');
    categories.forEach(cat => {
      console.log(`  - ${cat.id} | ${cat.name} (${cat.type})`);
    });
    
    const categoryId = categories[0].id;
    
    // Criar transação de teste
    const transactionId = uuidv4();
    const [result] = await connection.query(
      `INSERT INTO transactions (id, userId, categoryId, type, amount, description, date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [transactionId, userId, categoryId, 'income', 1000.00, 'Teste de transação', '2025-12-04']
    );
    
    console.log('\n✅ Transação criada com sucesso!');
    console.log('ID:', transactionId);
    
    // Verificar
    const [transactions] = await connection.query(
      'SELECT * FROM transactions WHERE id = ?',
      [transactionId]
    );
    console.log('\n📊 Transação criada:');
    console.log(transactions[0]);
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
  }
}

testTransaction();
