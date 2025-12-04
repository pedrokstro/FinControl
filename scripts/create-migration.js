const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function generateTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function sanitizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function getMigrationTemplate(name, type) {
  const templates = {
    table: `-- Migration: ${name}
-- Created at: ${new Date().toISOString()}

-- UP Migration
CREATE TABLE IF NOT EXISTS table_name (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_table_name_name ON table_name(name);

-- DOWN Migration (para rollback)
-- DROP TABLE IF EXISTS table_name;
`,

    column: `-- Migration: ${name}
-- Created at: ${new Date().toISOString()}

-- UP Migration
ALTER TABLE table_name
  ADD COLUMN column_name VARCHAR(255);

-- Create index if needed
-- CREATE INDEX idx_table_column ON table_name(column_name);

-- DOWN Migration (para rollback)
-- ALTER TABLE table_name DROP COLUMN column_name;
`,

    index: `-- Migration: ${name}
-- Created at: ${new Date().toISOString()}

-- UP Migration
CREATE INDEX idx_table_column ON table_name(column_name);

-- DOWN Migration (para rollback)
-- DROP INDEX IF EXISTS idx_table_column;
`,

    data: `-- Migration: ${name}
-- Created at: ${new Date().toISOString()}

-- UP Migration
INSERT INTO table_name (column1, column2) VALUES
  ('value1', 'value2'),
  ('value3', 'value4');

-- DOWN Migration (para rollback)
-- DELETE FROM table_name WHERE column1 IN ('value1', 'value3');
`,

    custom: `-- Migration: ${name}
-- Created at: ${new Date().toISOString()}

-- UP Migration
-- Escreva seu SQL aqui


-- DOWN Migration (para rollback)
-- Escreva o SQL de rollback aqui

`
  };
  
  return templates[type] || templates.custom;
}

async function createMigration() {
  try {
    console.log('\n🚀 Criador de Migrations\n');
    
    // Perguntar o nome da migration
    const name = await question('Nome da migration (ex: add_user_avatar): ');
    
    if (!name || name.trim() === '') {
      console.error('❌ Nome da migration é obrigatório');
      process.exit(1);
    }
    
    // Perguntar o tipo
    console.log('\nTipo de migration:');
    console.log('1. Criar tabela (table)');
    console.log('2. Adicionar coluna (column)');
    console.log('3. Criar índice (index)');
    console.log('4. Inserir dados (data)');
    console.log('5. Personalizado (custom)');
    
    const typeChoice = await question('\nEscolha o tipo (1-5): ');
    
    const typeMap = {
      '1': 'table',
      '2': 'column',
      '3': 'index',
      '4': 'data',
      '5': 'custom'
    };
    
    const type = typeMap[typeChoice] || 'custom';
    
    // Gerar nome do arquivo
    const timestamp = generateTimestamp();
    const sanitizedName = sanitizeName(name);
    const filename = `${timestamp}_${sanitizedName}.sql`;
    
    // Criar diretório de migrations se não existir
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true });
      console.log('📁 Diretório de migrations criado');
    }
    
    // Criar arquivo
    const filepath = path.join(migrationsDir, filename);
    const content = getMigrationTemplate(name, type);
    
    fs.writeFileSync(filepath, content, 'utf8');
    
    console.log('\n✅ Migration criada com sucesso!');
    console.log(`📄 Arquivo: ${filename}`);
    console.log(`📍 Caminho: ${filepath}`);
    console.log('\n💡 Edite o arquivo para adicionar suas alterações SQL');
    console.log('💡 Execute "npm run migrate" para aplicar as migrations\n');
    
  } catch (error) {
    console.error('❌ Erro ao criar migration:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Executar
createMigration();
