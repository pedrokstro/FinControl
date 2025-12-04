const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Carregar variáveis de ambiente
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Configuração do banco de dados
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'fincontrol_db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  charset: 'utf8mb4'
};

// Tabela para controle de migrations
const MIGRATIONS_TABLE = 'schema_migrations';

async function createMigrationsTable(connection) {
  const query = `
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      version VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  
  await connection.query(query);
  console.log('✅ Tabela de migrations criada/verificada');
}

async function getExecutedMigrations(connection) {
  const [rows] = await connection.query(
    `SELECT version FROM ${MIGRATIONS_TABLE} ORDER BY version`
  );
  return rows.map(row => row.version);
}

async function executeMigration(connection, migration) {
  const { version, name, sql } = migration;
  
  console.log(`\n🔄 Executando migration: ${version} - ${name}`);
  
  try {
    // Iniciar transação
    await connection.beginTransaction();
    
    // Executar SQL da migration
    await connection.query(sql);
    
    // Registrar migration executada
    await connection.query(
      `INSERT INTO ${MIGRATIONS_TABLE} (version, name) VALUES (?, ?)`,
      [version, name]
    );
    
    // Commit
    await connection.commit();
    
    console.log(`✅ Migration ${version} executada com sucesso`);
    return true;
  } catch (error) {
    // Rollback em caso de erro
    await connection.rollback();
    console.error(`❌ Erro ao executar migration ${version}:`, error.message);
    throw error;
  }
}

async function getMigrationFiles() {
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.log('⚠️  Diretório de migrations não encontrado');
    return [];
  }
  
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  return files.map(file => {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Formato esperado: YYYYMMDDHHMMSS_nome_da_migration.sql
    const match = file.match(/^(\d{14})_(.+)\.sql$/);
    
    if (!match) {
      throw new Error(`Nome de arquivo inválido: ${file}. Use o formato: YYYYMMDDHHMMSS_nome.sql`);
    }
    
    return {
      version: match[1],
      name: match[2].replace(/_/g, ' '),
      filename: file,
      sql
    };
  });
}

async function runMigrations() {
  let connection;
  
  try {
    console.log('🔌 Conectando ao banco de dados...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado ao banco de dados');
    
    // Criar tabela de controle de migrations
    await createMigrationsTable(connection);
    
    // Obter migrations já executadas
    const executedMigrations = await getExecutedMigrations(connection);
    console.log(`\n📊 Migrations já executadas: ${executedMigrations.length}`);
    
    // Obter arquivos de migration
    const migrationFiles = await getMigrationFiles();
    console.log(`📁 Arquivos de migration encontrados: ${migrationFiles.length}`);
    
    // Filtrar migrations pendentes
    const pendingMigrations = migrationFiles.filter(
      migration => !executedMigrations.includes(migration.version)
    );
    
    if (pendingMigrations.length === 0) {
      console.log('\n✅ Nenhuma migration pendente. Banco de dados está atualizado!');
      return;
    }
    
    console.log(`\n🚀 Executando ${pendingMigrations.length} migration(s) pendente(s)...\n`);
    
    // Executar migrations pendentes
    for (const migration of pendingMigrations) {
      await executeMigration(connection, migration);
    }
    
    console.log('\n✅ Todas as migrations foram executadas com sucesso!');
    
  } catch (error) {
    console.error('\n❌ Erro ao executar migrations:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexão com banco de dados encerrada');
    }
  }
}

// Executar
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('\n✅ Processo de migrations concluído');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Falha no processo de migrations:', error);
      process.exit(1);
    });
}

module.exports = { runMigrations };
