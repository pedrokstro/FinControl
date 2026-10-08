const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

async function createDemoUser() {
  try {
    // Gerar UUID e hash da senha
    const userId = uuidv4();
    const password = 'demo123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('Hash gerado:', hashedPassword);
    
    // Conectar ao banco
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'fincontrol_db'
    });
    
    console.log('✅ Conectado ao banco de dados');
    
    // Verificar se usuário já existe
    const [existing] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      ['demo@financeiro.com']
    );
    
    if (existing.length > 0) {
      console.log('⚠️  Usuário demo já existe. Atualizando senha...');
      await connection.query(
        'UPDATE users SET password = ? WHERE email = ?',
        [hashedPassword, 'demo@financeiro.com']
      );
      console.log('✅ Senha atualizada!');
    } else {
      // Inserir usuário demo
      const [result] = await connection.query(
        `INSERT INTO users (id, name, email, password, emailVerified, isAdmin, planType, isPremium)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, 'Usuário Demo', 'demo@financeiro.com', hashedPassword, true, false, 'free', false]
      );
      
      console.log('✅ Usuário demo criado com sucesso!');
      console.log('ID:', result.insertId);
    }
    
    // Verificar
    const [users] = await connection.query(
      'SELECT id, name, email, emailVerified, planType FROM users WHERE email = ?',
      ['demo@financeiro.com']
    );
    
    console.log('\n📋 Usuário criado:');
    console.log(users[0]);
    
    console.log('\n🔑 Credenciais de login:');
    console.log('Email: demo@financeiro.com');
    console.log('Senha: demo123');
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

createDemoUser();
