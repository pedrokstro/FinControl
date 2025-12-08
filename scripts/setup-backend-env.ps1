# Script para criar arquivo .env do backend com credenciais do Supabase

Write-Host "`n=== Configurar Backend .env - FinControl ===`n" -ForegroundColor Cyan

# Credenciais do Supabase
$DATABASE_URL = "postgresql://postgres:360106@db.hzazlkgpamawlqmvxyii.supabase.co:5432/postgres"

# Gerar JWT secrets
$JWT_SECRET = -join ((1..128) | ForEach-Object { '{0:x}' -f (Get-Random -Maximum 16) })
$JWT_REFRESH_SECRET = -join ((1..128) | ForEach-Object { '{0:x}' -f (Get-Random -Maximum 16) })

Write-Host "Gerando arquivo .env no backend..." -ForegroundColor Yellow

# Conteúdo do .env
$envContent = @"
# Application
NODE_ENV=development
PORT=5000
API_PREFIX=/api/v1

# Database (PostgreSQL - Supabase)
DATABASE_URL=$DATABASE_URL
DB_HOST=db.hzazlkgpamawlqmvxyii.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=360106
DB_DATABASE=postgres

# JWT
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# Logging
LOG_LEVEL=info
LOG_DIR=logs

# Email - Verificacao e Recuperacao de Senha
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Monitoring (optional)
SENTRY_DSN=
"@

# Criar arquivo .env no backend
$backendPath = Join-Path $PSScriptRoot "..\backend\.env"
$envContent | Out-File -FilePath $backendPath -Encoding UTF8

Write-Host "[OK] Arquivo backend/.env criado com sucesso!" -ForegroundColor Green

Write-Host "`n" + ("=" * 60) -ForegroundColor Gray
Write-Host "`nCredenciais configuradas:" -ForegroundColor Cyan
Write-Host "  - DATABASE_URL: postgresql://postgres:***@db.hzazlkgpamawlqmvxyii.supabase.co:5432/postgres" -ForegroundColor Gray
Write-Host "  - JWT_SECRET: Gerado automaticamente" -ForegroundColor Gray
Write-Host "  - JWT_REFRESH_SECRET: Gerado automaticamente" -ForegroundColor Gray

Write-Host "`n[AVISO] NAO COMMITAR O ARQUIVO .env!" -ForegroundColor Yellow
Write-Host "O arquivo ja esta no .gitignore`n" -ForegroundColor Gray
