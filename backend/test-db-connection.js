const { Client } = require('pg');
require('dotenv').config();

const testConnection = async () => {
  console.log('🔍 Testando conexão com PostgreSQL...\n');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME || 'fincontrol',
    password: process.env.DB_PASSWORD || 'fincontrol_password',
    database: process.env.DB_DATABASE || 'fincontrol_db',
  };

  console.log('📋 Configuração:');
  console.log(`   Host: ${config.host}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   Password: ${'*'.repeat(config.password.length)}\n`);

  const client = new Client(config);

  try {
    console.log('🔌 Conectando...');
    await client.connect();
    console.log('✅ Conexão estabelecida com sucesso!\n');

    // Testar query
    const result = await client.query('SELECT version()');
    console.log('📊 Versão do PostgreSQL:');
    console.log(`   ${result.rows[0].version}\n`);

    // Verificar se o database existe
    const dbCheck = await client.query(
      "SELECT datname FROM pg_database WHERE datname = $1",
      [config.database]
    );
    
    if (dbCheck.rows.length > 0) {
      console.log(`✅ Database '${config.database}' existe!`);
    } else {
      console.log(`⚠️  Database '${config.database}' NÃO existe!`);
      console.log(`\n💡 Execute no psql:`);
      console.log(`   CREATE DATABASE ${config.database};`);
    }

    await client.end();
    console.log('\n✅ Teste concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro ao conectar:');
    console.error(`   ${error.message}\n`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Dicas:');
      console.log('   - Verifique se o PostgreSQL está rodando');
      console.log('   - Confirme a porta (padrão: 5432)');
    } else if (error.code === '28P01') {
      console.log('💡 Dicas:');
      console.log('   - Verifique o usuário e senha no .env');
      console.log('   - Confirme as credenciais do PostgreSQL');
    } else if (error.code === '3D000') {
      console.log('💡 Dicas:');
      console.log(`   - O database '${config.database}' não existe`);
      console.log('   - Execute: CREATE DATABASE fincontrol_db;');
    }
    
    process.exit(1);
  }
};

testConnection();
