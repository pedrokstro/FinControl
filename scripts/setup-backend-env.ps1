# Script para criar arquivo .env do backend com credenciais do Supabase

Write-Host "`n=== Configurar Backend .env - FinControl ===`n" -ForegroundColor Cyan

# Credenciais do Supabase (conexão direta para desenvolvimento local)
# Para produção (Render), usar o pooler no RENDER_ENV_VARS.txt
$DATABASE_URL = "postgresql://postgres:YZAP2IMKvmE0S2lU@db.hzazlkgpamawlqmvxyii.supabase.co:6543/postgres"

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

# Database (PostgreSQL - Supabase Connection Pooler)
# Usando apenas DATABASE_URL para evitar conflitos
DATABASE_URL=$DATABASE_URL
# DB_HOST=aws-1-us-east-1.pooler.supabase.com
# DB_PORT=6543
# DB_USERNAME=postgres.hzazlkgpamawlqmvxyii
# DB_PASSWORD=360106
# DB_DATABASE=postgres

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

# Email - Resend
RESEND_API_KEY=re_HK3Ub5qF_JuXoVVZpVVacENR42xwKMHC3
EMAIL_FROM=FinControl suportfincontrol@gmail.com

# Email - SMTP Alternativo (Opcional)
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
Write-Host "  - DATABASE_URL: postgresql://postgres:***@db.hzazlkgpamawlqmvxyii.supabase.co:6543/postgres" -ForegroundColor Gray
Write-Host "  - RESEND_API_KEY: Configurada" -ForegroundColor Gray
Write-Host "  - JWT_SECRET: Gerado automaticamente" -ForegroundColor Gray
Write-Host "  - JWT_REFRESH_SECRET: Gerado automaticamente" -ForegroundColor Gray

Write-Host "`n[AVISO] NAO COMMITAR O ARQUIVO .env!" -ForegroundColor Yellow
Write-Host "O arquivo ja esta no .gitignore`n" -ForegroundColor Gray
