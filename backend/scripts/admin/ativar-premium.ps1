# Script PowerShell para ativar premium no usuário demo

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  ATIVANDO PREMIUM - USUARIO DEMO" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# 1. LOGIN
Write-Host "1. Fazendo login..." -ForegroundColor Yellow

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

    $token = $loginResponse.data.accessToken
    
    Write-Host "   Login OK!" -ForegroundColor Green
    Write-Host "   Token: $($token.Substring(0, 30))..." -ForegroundColor Gray
    Write-Host ""

    # 2. ATIVAR PREMIUM
    Write-Host "2. Ativando plano premium..." -ForegroundColor Yellow

    $activateBody = @{
        durationMonths = 1
    } | ConvertTo-Json

    $activateResponse = Invoke-RestMethod `
        -Uri "http://localhost:5000/api/v1/subscription/activate" `
        -Method Post `
        -ContentType "application/json" `
        -Headers @{
            "Authorization" = "Bearer $token"
        } `
        -Body $activateBody

    Write-Host "   Premium ativado!" -ForegroundColor Green
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "  RESULTADO" -ForegroundColor Cyan
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "Tipo de plano: $($activateResponse.data.planType)" -ForegroundColor White
    Write-Host "Premium ativo: $($activateResponse.data.isPremium)" -ForegroundColor White
    Write-Host "Data inicio: $($activateResponse.data.planStartDate)" -ForegroundColor White
    Write-Host "Data fim: $($activateResponse.data.planEndDate)" -ForegroundColor White
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Green
    Write-Host "  PROXIMO PASSO" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Green
    Write-Host "1. No frontend, faca LOGOUT" -ForegroundColor Yellow
    Write-Host "2. Faca LOGIN novamente" -ForegroundColor Yellow
    Write-Host "3. O banner premium deve sumir!" -ForegroundColor Yellow
    Write-Host ""

} catch {
    Write-Host ""
    Write-Host "ERRO:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifique se:" -ForegroundColor Yellow
    Write-Host "- O backend esta rodando (npm run dev)" -ForegroundColor White
    Write-Host "- A migration foi executada (npm run migration:premium)" -ForegroundColor White
    Write-Host "- O usuario demo existe no banco" -ForegroundColor White
}
