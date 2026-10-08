# Script para executar migrations SQL no PostgreSQL

$dbHost = if ($env:DB_HOST) { $env:DB_HOST } else { "localhost" }
$dbPort = if ($env:DB_PORT) { $env:DB_PORT } else { "5432" }
$dbName = if ($env:DB_NAME) { $env:DB_NAME } else { "fincontrol_db" }
$dbUser = if ($env:DB_USER) { $env:DB_USER } else { "postgres" }
$dbPassword = if ($env:DB_PASSWORD) { $env:DB_PASSWORD } else { "postgres" }

Write-Host "=== EXECUTANDO MIGRATIONS ===" -ForegroundColor Cyan
Write-Host ""

# Definir variável de ambiente para senha
$env:PGPASSWORD = $dbPassword

$migrationsDir = "migrations-sql"
$migrations = Get-ChildItem -Path $migrationsDir -Filter "*.sql" | Sort-Object Name

if ($migrations.Count -eq 0) {
    Write-Host "Nenhuma migration encontrada em $migrationsDir" -ForegroundColor Yellow
    exit
}

Write-Host "Migrations encontradas: $($migrations.Count)" -ForegroundColor Green
Write-Host ""

foreach ($migration in $migrations) {
    Write-Host "Executando: $($migration.Name)" -ForegroundColor Yellow
    
    try {
        # Executar migration
        $result = psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -f $migration.FullName 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ Sucesso!" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Erro ao executar migration" -ForegroundColor Red
            Write-Host "  Detalhes: $result" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Limpar variável de ambiente
Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue

Write-Host "=== MIGRATIONS CONCLUÍDAS ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Verificando estrutura do banco..." -ForegroundColor Yellow

# Verificar se as tabelas foram criadas
$env:PGPASSWORD = $dbPassword

Write-Host ""
Write-Host "Tabela users - campo theme:" -ForegroundColor Cyan
psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -c "SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'theme';"

Write-Host ""
Write-Host "Tabela user_preferences:" -ForegroundColor Cyan
psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -c "SELECT table_name FROM information_schema.tables WHERE table_name = 'user_preferences';"

Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "=== CONCLUÍDO ===" -ForegroundColor Green
