const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_DATABASE || 'fincontrol_db',
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function executeMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Conectando ao banco de dados...');
    
    // Ler arquivo SQL
    const migrationPath = path.join(__dirname, 'migrations-sql', '005-add-savings-goals.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Arquivo de migration carregado: 005-add-savings-goals.sql');
    console.log('🚀 Executando migration...\n');
    
    // Executar migration
    await client.query(migrationSQL);
    
    console.log('✅ Migration executada com sucesso!');
    console.log('\n📊 Verificando estrutura criada...\n');
    
    // Verificar se a tabela foi criada
    const tableCheck = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'savings_goals'
      ORDER BY ordinal_position;
    `);
    
    if (tableCheck.rows.length > 0) {
      console.log('✅ Tabela savings_goals criada com sucesso!');
      console.log('\n📋 Colunas:');
      tableCheck.rows.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
      });
    }
    
    // Verificar índices
    const indexCheck = await client.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'savings_goals';
    `);
    
    if (indexCheck.rows.length > 0) {
      console.log('\n📇 Índices criados:');
      indexCheck.rows.forEach(idx => {
        console.log(`  - ${idx.indexname}`);
      });
    }
    
    // Verificar constraints
    const constraintCheck = await client.query(`
      SELECT conname, contype
      FROM pg_constraint
      WHERE conrelid = 'savings_goals'::regclass;
    `);
    
    if (constraintCheck.rows.length > 0) {
      console.log('\n🔒 Constraints criadas:');
      constraintCheck.rows.forEach(con => {
        const type = con.contype === 'p' ? 'PRIMARY KEY' : 
                     con.contype === 'f' ? 'FOREIGN KEY' : 
                     con.contype === 'u' ? 'UNIQUE' : 
                     con.contype === 'c' ? 'CHECK' : 'OTHER';
        console.log(`  - ${con.conname} (${type})`);
      });
    }
    
    console.log('\n✨ Migration concluída com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('  1. Reinicie o backend: npm run dev');
    console.log('  2. Teste os endpoints de metas:');
    console.log('     - POST /api/v1/savings-goals');
    console.log('     - GET /api/v1/savings-goals/current');
    console.log('     - GET /api/v1/savings-goals');
    
  } catch (error) {
    console.error('❌ Erro ao executar migration:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

executeMigration()
  .then(() => {
    console.log('\n✅ Processo finalizado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
  });
