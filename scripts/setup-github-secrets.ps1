# Script para configurar GitHub Secrets automaticamente
# Requer: GitHub CLI (gh) instalado e autenticado

param(
    [string]$DatabaseUrl = "",
    [string]$DatabasePassword = ""
)

Write-Host "`n🔐 Setup de GitHub Secrets - FinControl`n" -ForegroundColor Cyan
Write-Host "━" * 60 -ForegroundColor Gray

# Verificar se GitHub CLI está instalado
$ghInstalled = Get-Command gh -ErrorAction SilentlyContinue
if (-not $ghInstalled) {
    Write-Host "❌ GitHub CLI não encontrado!" -ForegroundColor Red
    Write-Host "`n📥 Instale com: winget install GitHub.cli" -ForegroundColor Yellow
    Write-Host "Ou baixe em: https://cli.github.com/`n" -ForegroundColor Yellow
    exit 1
}

# Verificar autenticação
Write-Host "`n🔍 Verificando autenticação..." -ForegroundColor Yellow
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Não autenticado no GitHub!" -ForegroundColor Red
    Write-Host "`n🔑 Execute: gh auth login`n" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Autenticado com sucesso!" -ForegroundColor Green

# Gerar secrets
Write-Host "`n🔑 Gerando secrets seguros..." -ForegroundColor Yellow

# Gerar JWT_SECRET (64 bytes = 128 chars hex)
$jwtSecret = -join ((1..128) | ForEach-Object { '{0:x}' -f (Get-Random -Maximum 16) })

# Gerar SESSION_SECRET (32 bytes = 64 chars hex)
$sessionSecret = -join ((1..64) | ForEach-Object { '{0:x}' -f (Get-Random -Maximum 16) })

# Gerar ENCRYPTION_KEY (32 bytes = 64 chars hex)
$encryptionKey = -join ((1..64) | ForEach-Object { '{0:x}' -f (Get-Random -Maximum 16) })

Write-Host "✅ Secrets gerados!" -ForegroundColor Green

# Solicitar DATABASE_URL se não fornecido
if ([string]::IsNullOrWhiteSpace($DatabaseUrl)) {
    Write-Host "`n📊 Configure o banco de dados PostgreSQL:" -ForegroundColor Cyan
    Write-Host "Formato: postgresql://usuario:senha@host:5432/database`n" -ForegroundColor Gray
    $DatabaseUrl = Read-Host "DATABASE_URL"
}

# Solicitar DATABASE_PASSWORD se não fornecido
if ([string]::IsNullOrWhiteSpace($DatabasePassword)) {
    Write-Host "`n🔒 Digite a senha do banco de dados:" -ForegroundColor Cyan
    $securePassword = Read-Host "DATABASE_PASSWORD" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    $DatabasePassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

Write-Host "`n━" * 60 -ForegroundColor Gray
Write-Host "`n📤 Enviando secrets para GitHub...`n" -ForegroundColor Yellow

# Função para adicionar secret
function Add-GitHubSecret {
    param(
        [string]$Name,
        [string]$Value
    )
    
    Write-Host "  📝 Adicionando $Name..." -NoNewline
    
    try {
        $Value | gh secret set $Name 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host " ✅" -ForegroundColor Green
            return $true
        } else {
            Write-Host " ❌" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host " ❌ Erro: $_" -ForegroundColor Red
        return $false
    }
}

# Adicionar secrets
$success = 0
$total = 0

# Secrets essenciais
$total++
if (Add-GitHubSecret "JWT_SECRET" $jwtSecret) { $success++ }

$total++
if (Add-GitHubSecret "DATABASE_URL" $DatabaseUrl) { $success++ }

$total++
if (Add-GitHubSecret "DATABASE_PASSWORD" $DatabasePassword) { $success++ }

# Secrets adicionais
$total++
if (Add-GitHubSecret "SESSION_SECRET" $sessionSecret) { $success++ }

$total++
if (Add-GitHubSecret "ENCRYPTION_KEY" $encryptionKey) { $success++ }

# Resumo
Write-Host "`n━" * 60 -ForegroundColor Gray
Write-Host "`n📊 Resumo:" -ForegroundColor Cyan
Write-Host "  ✅ Secrets adicionados: $success/$total" -ForegroundColor Green

if ($success -eq $total) {
    Write-Host "`n🎉 Todos os secrets foram configurados com sucesso!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Alguns secrets falharam. Verifique as mensagens acima." -ForegroundColor Yellow
}

# Listar secrets configurados
Write-Host "`n📋 Secrets configurados no repositório:" -ForegroundColor Cyan
gh secret list

Write-Host "`n━" * 60 -ForegroundColor Gray
Write-Host "`n💾 Salvando cópia local dos secrets (NÃO COMMITAR!)..." -ForegroundColor Yellow

# Criar arquivo .env.local com os secrets (para desenvolvimento)
$envContent = @"
# Secrets gerados em $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# ⚠️ NÃO COMMITAR ESTE ARQUIVO!

# Backend
DATABASE_URL=$DatabaseUrl
DATABASE_PASSWORD=$DatabasePassword
JWT_SECRET=$jwtSecret
SESSION_SECRET=$sessionSecret
ENCRYPTION_KEY=$encryptionKey

# Frontend
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=FinControl
VITE_APP_VERSION=1.8.0
NODE_ENV=development
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8
Write-Host "✅ Arquivo .env.local criado (use para desenvolvimento local)" -ForegroundColor Green

Write-Host "`n━" * 60 -ForegroundColor Gray
Write-Host "`n🔗 Links úteis:" -ForegroundColor Cyan
Write-Host "  • Secrets: https://github.com/pedrokstro/FinControl/settings/secrets/actions" -ForegroundColor Gray
Write-Host "  • Actions: https://github.com/pedrokstro/FinControl/actions" -ForegroundColor Gray
Write-Host "  • Releases: https://github.com/pedrokstro/FinControl/releases" -ForegroundColor Gray

Write-Host "`n✨ Configuração concluída!`n" -ForegroundColor Green
