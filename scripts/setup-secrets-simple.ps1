# Script para configurar GitHub Secrets automaticamente
# Requer: GitHub CLI (gh) instalado e autenticado

param(
    [string]$DatabaseUrl = "",
    [string]$DatabasePassword = ""
)

Write-Host "`n=== Setup de GitHub Secrets - FinControl ===`n" -ForegroundColor Cyan

# Verificar se GitHub CLI está instalado
$ghInstalled = Get-Command gh -ErrorAction SilentlyContinue
if (-not $ghInstalled) {
    Write-Host "[ERRO] GitHub CLI nao encontrado!" -ForegroundColor Red
    Write-Host "`nInstale com: winget install GitHub.cli" -ForegroundColor Yellow
    Write-Host "Ou baixe em: https://cli.github.com/`n" -ForegroundColor Yellow
    exit 1
}

# Verificar autenticação
Write-Host "Verificando autenticacao..." -ForegroundColor Yellow
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERRO] Nao autenticado no GitHub!" -ForegroundColor Red
    Write-Host "`nExecute: gh auth login`n" -ForegroundColor Yellow
    exit 1
}
Write-Host "[OK] Autenticado com sucesso!`n" -ForegroundColor Green

# Gerar secrets
Write-Host "Gerando secrets seguros..." -ForegroundColor Yellow

# Gerar JWT_SECRET (64 bytes = 128 chars hex)
$jwtSecret = -join ((1..128) | ForEach-Object { '{0:x}' -f (Get-Random -Maximum 16) })

# Gerar SESSION_SECRET (32 bytes = 64 chars hex)
$sessionSecret = -join ((1..64) | ForEach-Object { '{0:x}' -f (Get-Random -Maximum 16) })

# Gerar ENCRYPTION_KEY (32 bytes = 64 chars hex)
$encryptionKey = -join ((1..64) | ForEach-Object { '{0:x}' -f (Get-Random -Maximum 16) })

Write-Host "[OK] Secrets gerados!`n" -ForegroundColor Green

# Solicitar DATABASE_URL se não fornecido
if ([string]::IsNullOrWhiteSpace($DatabaseUrl)) {
    Write-Host "Configure o banco de dados PostgreSQL:" -ForegroundColor Cyan
    Write-Host "Formato: postgresql://usuario:senha@host:5432/database`n" -ForegroundColor Gray
    $DatabaseUrl = Read-Host "DATABASE_URL"
}

# Solicitar DATABASE_PASSWORD se não fornecido
if ([string]::IsNullOrWhiteSpace($DatabasePassword)) {
    Write-Host "`nDigite a senha do banco de dados:" -ForegroundColor Cyan
    $securePassword = Read-Host "DATABASE_PASSWORD" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    $DatabasePassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

Write-Host "`n" + ("=" * 60) -ForegroundColor Gray
Write-Host "`nEnviando secrets para GitHub...`n" -ForegroundColor Yellow

# Função para adicionar secret
function Add-GitHubSecret {
    param(
        [string]$Name,
        [string]$Value
    )
    
    Write-Host "  Adicionando $Name..." -NoNewline
    
    try {
        $Value | gh secret set $Name 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host " [OK]" -ForegroundColor Green
            return $true
        } else {
            Write-Host " [ERRO]" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host " [ERRO]: $_" -ForegroundColor Red
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
Write-Host "`n" + ("=" * 60) -ForegroundColor Gray
Write-Host "`nResumo:" -ForegroundColor Cyan
Write-Host "  Secrets adicionados: $success/$total" -ForegroundColor Green

if ($success -eq $total) {
    Write-Host "`n[OK] Todos os secrets foram configurados com sucesso!" -ForegroundColor Green
} else {
    Write-Host "`n[AVISO] Alguns secrets falharam. Verifique as mensagens acima." -ForegroundColor Yellow
}

# Listar secrets configurados
Write-Host "`nSecrets configurados no repositorio:" -ForegroundColor Cyan
gh secret list

Write-Host "`n" + ("=" * 60) -ForegroundColor Gray
Write-Host "`nSalvando copia local dos secrets (NAO COMMITAR!)..." -ForegroundColor Yellow

# Criar arquivo .env.local com os secrets (para desenvolvimento)
$envContent = @"
# Secrets gerados em $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# NAO COMMITAR ESTE ARQUIVO!

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
Write-Host "[OK] Arquivo .env.local criado (use para desenvolvimento local)" -ForegroundColor Green

Write-Host "`n" + ("=" * 60) -ForegroundColor Gray
Write-Host "`nLinks uteis:" -ForegroundColor Cyan
Write-Host "  - Secrets: https://github.com/pedrokstro/FinControl/settings/secrets/actions" -ForegroundColor Gray
Write-Host "  - Actions: https://github.com/pedrokstro/FinControl/actions" -ForegroundColor Gray
Write-Host "  - Releases: https://github.com/pedrokstro/FinControl/releases" -ForegroundColor Gray

Write-Host "`n[OK] Configuracao concluida!`n" -ForegroundColor Green
