# Script para ativar premium no usuário demo
# Execute: .\activate-demo-premium.ps1

Write-Host "Fazendo login..." -ForegroundColor Cyan

try {
    # Login
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body '{"email": "demo@financeiro.com", "password": "demo123"}'

    $token = $loginResponse.data.accessToken

    if ($token) {
        Write-Host "Login realizado com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Ativando plano premium..." -ForegroundColor Cyan
        
        # Ativar premium
        $activateResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/subscription/activate" `
            -Method Post `
            -Headers @{
                "Authorization" = "Bearer $token"
                "Content-Type" = "application/json"
            } `
            -Body '{"durationMonths": 1}'
        
        Write-Host "Premium ativado com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Status do plano:" -ForegroundColor Yellow
        Write-Host "  Tipo: $($activateResponse.data.planType)"
        Write-Host "  Premium: $($activateResponse.data.isPremium)"
        Write-Host ""
        Write-Host "Agora faca logout e login novamente no frontend!" -ForegroundColor Green
    }
} catch {
    Write-Host "Erro: $_" -ForegroundColor Red
}
