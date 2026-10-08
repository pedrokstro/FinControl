# Teste de Login - FinControl API

Write-Host "Testando login com usuario demo..." -ForegroundColor Cyan

$body = @{
    email = "demo@financeiro.com"
    password = "demo123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body

    Write-Host ""
    Write-Host "LOGIN REALIZADO COM SUCESSO!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Usuario: $($response.data.user.name)" -ForegroundColor White
    Write-Host "Email: $($response.data.user.email)" -ForegroundColor White
    Write-Host ""
    Write-Host "Access Token:" -ForegroundColor Yellow
    Write-Host $response.data.accessToken -ForegroundColor Gray
    Write-Host ""
    Write-Host "Use este token no Swagger (http://localhost:5000/api-docs)" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "ERRO ao fazer login:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
