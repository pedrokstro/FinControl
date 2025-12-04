const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuração
const BACKUP_DIR = path.join(__dirname, '..', 'backups');
const MAX_BACKUPS = 10; // Manter apenas os últimos 10 backups

async function createBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log('📁 Diretório de backups criado');
  }
}

async function generateBackupFilename() {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `backup_${timestamp}.sql`;
}

async function createBackup() {
  try {
    console.log('🔄 Iniciando backup do banco de dados...');
    
    await createBackupDir();
    
    const filename = await generateBackupFilename();
    const filepath = path.join(BACKUP_DIR, filename);
    
    // Extrair informações da DATABASE_URL
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL não configurada');
    }
    
    // Parse da URL do banco
    const url = new URL(dbUrl);
    const host = url.hostname;
    const port = url.port || '5432';
    const database = url.pathname.slice(1);
    const user = url.username;
    const password = url.password;
    
    // Comando pg_dump
    const command = `PGPASSWORD="${password}" pg_dump -h ${host} -p ${port} -U ${user} -d ${database} -F p -f "${filepath}"`;
    
    console.log(`📦 Criando backup: ${filename}`);
    
    await execAsync(command);
    
    const stats = fs.statSync(filepath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`✅ Backup criado com sucesso: ${filename} (${fileSizeMB} MB)`);
    
    // Limpar backups antigos
    await cleanOldBackups();
    
    return filepath;
    
  } catch (error) {
    console.error('❌ Erro ao criar backup:', error.message);
    throw error;
  }
}

async function cleanOldBackups() {
  try {
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.startsWith('backup_') && file.endsWith('.sql'))
      .map(file => ({
        name: file,
        path: path.join(BACKUP_DIR, file),
        time: fs.statSync(path.join(BACKUP_DIR, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);
    
    if (files.length > MAX_BACKUPS) {
      const filesToDelete = files.slice(MAX_BACKUPS);
      
      console.log(`\n🗑️  Removendo ${filesToDelete.length} backup(s) antigo(s)...`);
      
      for (const file of filesToDelete) {
        fs.unlinkSync(file.path);
        console.log(`   Removido: ${file.name}`);
      }
    }
  } catch (error) {
    console.error('⚠️  Erro ao limpar backups antigos:', error.message);
  }
}

async function listBackups() {
  try {
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.startsWith('backup_') && file.endsWith('.sql'))
      .map(file => {
        const filepath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filepath);
        return {
          name: file,
          size: (stats.size / (1024 * 1024)).toFixed(2) + ' MB',
          date: stats.mtime.toLocaleString('pt-BR')
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));
    
    console.log('\n📋 Backups disponíveis:');
    files.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file.name} - ${file.size} - ${file.date}`);
    });
    
    return files;
  } catch (error) {
    console.error('❌ Erro ao listar backups:', error.message);
    return [];
  }
}

async function restoreBackup(backupFile) {
  try {
    console.log(`🔄 Restaurando backup: ${backupFile}`);
    
    const filepath = path.join(BACKUP_DIR, backupFile);
    
    if (!fs.existsSync(filepath)) {
      throw new Error(`Arquivo de backup não encontrado: ${backupFile}`);
    }
    
    // Extrair informações da DATABASE_URL
    const dbUrl = process.env.DATABASE_URL;
    const url = new URL(dbUrl);
    const host = url.hostname;
    const port = url.port || '5432';
    const database = url.pathname.slice(1);
    const user = url.username;
    const password = url.password;
    
    // Comando psql para restaurar
    const command = `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${user} -d ${database} -f "${filepath}"`;
    
    await execAsync(command);
    
    console.log('✅ Backup restaurado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao restaurar backup:', error.message);
    throw error;
  }
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'create':
      createBackup()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
      
    case 'list':
      listBackups()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
      
    case 'restore':
      const backupFile = args[1];
      if (!backupFile) {
        console.error('❌ Especifique o arquivo de backup para restaurar');
        console.log('Uso: node backup-database.js restore <nome-do-arquivo>');
        process.exit(1);
      }
      restoreBackup(backupFile)
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
      
    default:
      console.log('Uso:');
      console.log('  node backup-database.js create   - Criar novo backup');
      console.log('  node backup-database.js list     - Listar backups');
      console.log('  node backup-database.js restore <arquivo> - Restaurar backup');
      process.exit(0);
  }
}

module.exports = { createBackup, listBackups, restoreBackup };
