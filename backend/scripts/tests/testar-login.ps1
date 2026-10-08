# Script para testar o que o login retorna

Write-Host "Testando login do usuario demo..." -ForegroundColor Cyan
Write-Host ""

$loginBody = @{
    email = "demo@financeiro.com"
    password = "demo123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod `
        -Uri "http://localhost:5000/api/v1/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody

    Write-Host "RESPOSTA DO LOGIN:" -ForegroundColor Green
    Write-Host "==================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Usuario:" -ForegroundColor Yellow
    Write-Host "  ID: $($response.data.user.id)"
    Write-Host "  Nome: $($response.data.user.name)"
    Write-Host "  Email: $($response.data.user.email)"
    Write-Host "  Role: $($response.data.user.role)"
    Write-Host "  Premium: $($response.data.user.isPremium)" -ForegroundColor $(if ($response.data.user.isPremium) { "Green" } else { "Red" })
    Write-Host "  Plan Type: $($response.data.user.planType)"
    Write-Host "  Plan End Date: $($response.data.user.planEndDate)"
    Write-Host ""
    
    if ($response.data.user.isPremium -eq $true) {
        Write-Host "Usuario e PREMIUM!" -ForegroundColor Green
    } else {
        Write-Host "Usuario NAO e premium!" -ForegroundColor Red
        Write-Host "Execute: .\ativar-premium.ps1" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "JSON Completo:" -ForegroundColor Gray
    Write-Host ($response | ConvertTo-Json -Depth 10)

} catch {
    Write-Host "Erro ao fazer login:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
