const { Client } = require('pg');

async function testConnection() {
  console.log('🔍 Testando conexão com PostgreSQL...\n');
  
  // Ler variáveis de ambiente - forçar string
  const password = String(process.env.DB_PASSWORD || '360106');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'fincontrol_db',
    user: process.env.DB_USER || 'postgres',
    password: password
  };
  
  console.log('📋 Configuração:');
  console.log(`   Host: ${config.host}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Password: ${'*'.repeat(config.password.length)}\n`);
  
  const client = new Client(config);
  
  try {
    console.log('🔌 Conectando...');
    await client.connect();
    console.log('✅ Conexão estabelecida com sucesso!\n');
    
    // Testar query simples
    const result = await client.query('SELECT version()');
    console.log('📊 Versão do PostgreSQL:');
    console.log(`   ${result.rows[0].version}\n`);
    
    // Verificar se tabelas existem
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📁 Tabelas existentes:');
    if (tables.rows.length === 0) {
      console.log('   Nenhuma tabela encontrada (banco vazio)\n');
    } else {
      tables.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.table_name}`);
      });
      console.log('');
    }
    
    console.log('✅ Teste de conexão concluído com sucesso!');
    console.log('💡 Você pode executar as migrations agora: npm run migrate\n');
    
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
    console.error('\n💡 Possíveis soluções:');
    console.error('   1. Verificar se PostgreSQL está rodando');
    console.error('   2. Verificar se a senha está correta no .env');
    console.error('   3. Verificar se o banco "fincontrol_db" existe');
    console.error('   4. Verificar se o usuário "postgres" tem permissão\n');
    
    if (error.message.includes('password')) {
      console.error('⚠️  Erro de senha detectado!');
      console.error('   Atualize DB_PASSWORD no arquivo .env com a senha correta\n');
    }
    
    if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.error('⚠️  Banco de dados não existe!');
      console.error('   Crie o banco com: CREATE DATABASE fincontrol_db;\n');
    }
    
    process.exit(1);
  } finally {
    await client.end();
  }
}

testConnection();
