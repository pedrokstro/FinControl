# Script para verificar se usuário demo existe e criar se necessário

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  VERIFICANDO USUARIO DEMO" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Tentar fazer login
Write-Host "Tentando fazer login..." -ForegroundColor Yellow

$loginBody = @{
    email = "demo@financeiro.com"
    password = "demo123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod `
        -Uri "http://localhost:5000/api/v1/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody

    Write-Host "Usuario demo existe!" -ForegroundColor Green
    Write-Host "Email: $($loginResponse.data.user.email)" -ForegroundColor White
    Write-Host "Nome: $($loginResponse.data.user.name)" -ForegroundColor White
    Write-Host "Premium: $($loginResponse.data.user.isPremium)" -ForegroundColor White
    Write-Host ""
    
    if ($loginResponse.data.user.isPremium -eq $true) {
        Write-Host "Usuario ja e premium!" -ForegroundColor Green
    } else {
        Write-Host "Usuario nao e premium. Execute: .\ativar-premium.ps1" -ForegroundColor Yellow
    }

} catch {
    Write-Host "Usuario demo NAO existe!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Criando usuario demo..." -ForegroundColor Yellow
    
    $registerBody = @{
        name = "Usuario Demo"
        email = "demo@financeiro.com"
        password = "demo123"
    } | ConvertTo-Json
    
    try {
        $registerResponse = Invoke-RestMethod `
            -Uri "http://localhost:5000/api/v1/auth/register" `
            -Method Post `
            -ContentType "application/json" `
            -Body $registerBody
        
        Write-Host "Usuario demo criado com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Agora execute: .\ativar-premium.ps1" -ForegroundColor Yellow
        
    } catch {
        Write-Host "Erro ao criar usuario:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}
