const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'fincontrol_db',
  user: process.env.DB_USER || 'fincontrol',
  password: String(process.env.DB_PASSWORD || 'fincontrol_password'),
  charset: 'utf8mb4'
};

const MIGRATIONS_TABLE = 'schema_migrations';

async function getMigrationStatus() {
  let connection;
  
  try {
    console.log('🔌 Conectando ao banco de dados...\n');
    connection = await mysql.createConnection(dbConfig);
    
    // Verificar se tabela existe
    const [tableExists] = await connection.query(`
      SELECT COUNT(*) as count
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
      AND table_name = '${MIGRATIONS_TABLE}'
    `);
    
    if (tableExists[0].count === 0) {
      console.log('⚠️  Tabela de migrations não existe ainda');
      console.log('💡 Execute "npm run migrate" para criar\n');
      return;
    }
    
    // Obter migrations executadas
    const [executedMigrations] = await connection.query(
      `SELECT version, name, executed_at FROM ${MIGRATIONS_TABLE} ORDER BY version`
    );
    
    // Obter arquivos de migration
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const migrationFiles = fs.existsSync(migrationsDir)
      ? fs.readdirSync(migrationsDir)
          .filter(file => file.endsWith('.sql'))
          .sort()
      : [];
    
    // Criar mapa de migrations executadas
    const executedMap = new Map(
      executedMigrations.map(m => [m.version, m])
    );
    
    // Analisar status
    const pending = [];
    const executed = [];
    
    migrationFiles.forEach(file => {
      const match = file.match(/^(\d{14})_(.+)\.sql$/);
      if (match) {
        const version = match[1];
        const name = match[2].replace(/_/g, ' ');
        
        if (executedMap.has(version)) {
          executed.push({
            version,
            name,
            filename: file,
            executedAt: executedMap.get(version).executed_at
          });
        } else {
          pending.push({
            version,
            name,
            filename: file
          });
        }
      }
    });
    
    // Exibir status
    console.log('📊 STATUS DAS MIGRATIONS\n');
    console.log('═'.repeat(80));
    
    // Migrations executadas
    console.log('\n✅ MIGRATIONS EXECUTADAS:');
    if (executed.length === 0) {
      console.log('   Nenhuma migration executada ainda\n');
    } else {
      console.log(`   Total: ${executed.length}\n`);
      executed.forEach((m, index) => {
        const date = new Date(m.executedAt).toLocaleString('pt-BR');
        console.log(`   ${index + 1}. ${m.version} - ${m.name}`);
        console.log(`      Executada em: ${date}\n`);
      });
    }
    
    // Migrations pendentes
    console.log('⏳ MIGRATIONS PENDENTES:');
    if (pending.length === 0) {
      console.log('   Nenhuma migration pendente\n');
    } else {
      console.log(`   Total: ${pending.length}\n`);
      pending.forEach((m, index) => {
        console.log(`   ${index + 1}. ${m.version} - ${m.name}`);
        console.log(`      Arquivo: ${m.filename}\n`);
      });
      console.log('💡 Execute "npm run migrate" para aplicar as migrations pendentes\n');
    }
    
    console.log('═'.repeat(80));
    
    // Resumo
    console.log('\n📈 RESUMO:');
    console.log(`   Total de arquivos: ${migrationFiles.length}`);
    console.log(`   Executadas: ${executed.length}`);
    console.log(`   Pendentes: ${pending.length}`);
    console.log(`   Status: ${pending.length === 0 ? '✅ Atualizado' : '⚠️  Migrations pendentes'}\n`);
    
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Executar
if (require.main === module) {
  getMigrationStatus()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { getMigrationStatus };
