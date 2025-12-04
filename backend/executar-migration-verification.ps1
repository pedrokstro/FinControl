# Script para executar migration de verification_codes

Write-Host "=== EXECUTANDO MIGRATION: VERIFICATION CODES ===" -ForegroundColor Cyan
Write-Host ""

# Configurações do banco
$dbHost = "localhost"
$dbPort = "5432"
$dbUser = "fincontrol"
$dbPassword = "fincontrol_password"
$dbName = "fincontrol_db"

# Caminho do arquivo SQL
$sqlFile = "migrations-sql\003-create-verification-codes.sql"

Write-Host "Verificando arquivo SQL..." -ForegroundColor Yellow
if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ Arquivo não encontrado: $sqlFile" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Arquivo encontrado!" -ForegroundColor Green
Write-Host ""

# Ler conteúdo do SQL
$sqlContent = Get-Content $sqlFile -Raw

Write-Host "Conectando ao banco de dados..." -ForegroundColor Yellow
Write-Host "Host: $dbHost" -ForegroundColor Gray
Write-Host "Database: $dbName" -ForegroundColor Gray
Write-Host ""

try {
    # Criar connection string
    $connectionString = "Host=$dbHost;Port=$dbPort;Database=$dbName;Username=$dbUser;Password=$dbPassword"
    
    # Usar Npgsql para executar SQL
    Add-Type -Path "C:\Program Files\PostgreSQL\15\bin\Npgsql.dll" -ErrorAction SilentlyContinue
    
    # Se Npgsql não estiver disponível, usar método alternativo
    Write-Host "Executando migration via DBeaver/pgAdmin..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 COPIE E EXECUTE O SQL ABAIXO NO DBeaver/pgAdmin:" -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host $sqlContent -ForegroundColor White
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "ℹ️  Instruções:" -ForegroundColor Yellow
    Write-Host "1. Abra o DBeaver ou pgAdmin" -ForegroundColor White
    Write-Host "2. Conecte ao banco 'fincontrol_db'" -ForegroundColor White
    Write-Host "3. Copie o SQL acima" -ForegroundColor White
    Write-Host "4. Execute no SQL Editor" -ForegroundColor White
    Write-Host ""
    
    # Salvar SQL em arquivo temporário para facilitar
    $tempFile = "temp-migration.sql"
    $sqlContent | Out-File -FilePath $tempFile -Encoding UTF8
    Write-Host "✅ SQL salvo em: $tempFile" -ForegroundColor Green
    Write-Host "   Você pode abrir este arquivo no DBeaver" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== MIGRATION PREPARADA ===" -ForegroundColor Cyan
