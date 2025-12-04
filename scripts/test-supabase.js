const { Client } = require('pg');

async function testSupabase() {
  console.log('🔍 Testando conexão com Supabase...\n');
  
  // Usar connectionString completa
  const connectionString = 'postgresql://postgres:cfJT36rKu9g3vTIK@db.hzazlkgpamawlqmvxyii.supabase.co:5432/postgres';
  
  const config = {
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  };
  
  console.log('📋 Configuração:');
  console.log(`   Connection String: ${connectionString.replace(/:[^:@]+@/, ':****@')}`);
  console.log(`   SSL: Habilitado\n`);
  
  const client = new Client(config);
  
  try {
    console.log('🔌 Conectando ao Supabase...');
    await client.connect();
    console.log('✅ Conexão estabelecida com sucesso!\n');
    
    // Testar query
    const result = await client.query('SELECT version()');
    console.log('📊 Versão do PostgreSQL:');
    console.log(`   ${result.rows[0].version}\n`);
    
    // Verificar tabelas
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📁 Tabelas existentes no Supabase:');
    if (tables.rows.length === 0) {
      console.log('   Nenhuma tabela encontrada (banco vazio)\n');
      console.log('💡 Execute "npm run migrate" para criar as tabelas\n');
    } else {
      tables.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.table_name}`);
      });
      console.log('');
    }
    
    console.log('✅ Teste de conexão com Supabase concluído!');
    console.log('🚀 Pronto para executar migrations!\n');
    
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
    console.error('\n💡 Verifique:');
    console.error('   1. Connection string está correta');
    console.error('   2. Senha está correta');
    console.error('   3. Projeto Supabase está ativo\n');
    process.exit(1);
  } finally {
    await client.end();
  }
}

testSupabase();
