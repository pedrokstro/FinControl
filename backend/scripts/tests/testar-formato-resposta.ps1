# Script para testar formato da resposta da API
$baseUrl = "http://localhost:5000/api/v1"

Write-Host "=== TESTE DE FORMATO DA RESPOSTA ===" -ForegroundColor Cyan
Write-Host ""

# Fazer login
$loginBody = @{
    email = "demo@financeiro.com"
    password = "demo123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResponse.data.accessToken

$headers = @{
    "Authorization" = "Bearer $token"
}

# Buscar transações
Write-Host "Buscando transacoes..." -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$baseUrl/transactions?limit=5" -Method GET -Headers $headers

Write-Host ""
Write-Host "=== ESTRUTURA DA RESPOSTA ===" -ForegroundColor Cyan
Write-Host ""

# Mostrar estrutura completa
Write-Host "Chaves no nivel raiz:" -ForegroundColor Yellow
$response | Get-Member -MemberType NoteProperty | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }

Write-Host ""
Write-Host "Conteudo completo (JSON):" -ForegroundColor Yellow
$response | ConvertTo-Json -Depth 3

Write-Host ""
Write-Host "=== ANALISE ===" -ForegroundColor Cyan

if ($response.success) {
    Write-Host "success: $($response.success)" -ForegroundColor Green
}

if ($response.message) {
    Write-Host "message: $($response.message)" -ForegroundColor Green
}

if ($response.data) {
    Write-Host "data existe: SIM" -ForegroundColor Green
    Write-Host ""
    Write-Host "Chaves dentro de 'data':" -ForegroundColor Yellow
    $response.data | Get-Member -MemberType NoteProperty | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }
    
    if ($response.data.transactions) {
        Write-Host ""
        Write-Host "data.transactions existe: SIM" -ForegroundColor Green
        Write-Host "Quantidade: $($response.data.transactions.Count)" -ForegroundColor Green
    }
    
    if ($response.data.total) {
        Write-Host "data.total: $($response.data.total)" -ForegroundColor Green
    }
    
    if ($response.data.page) {
        Write-Host "data.page: $($response.data.page)" -ForegroundColor Green
    }
}

if ($response.meta) {
    Write-Host ""
    Write-Host "meta existe: SIM" -ForegroundColor Green
    Write-Host "Chaves dentro de 'meta':" -ForegroundColor Yellow
    $response.meta | Get-Member -MemberType NoteProperty | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }
}

Write-Host ""
Write-Host "=== FORMATO ESPERADO PELO FRONTEND ===" -ForegroundColor Cyan
Write-Host "O frontend espera:" -ForegroundColor Yellow
Write-Host "  response.data.data.transactions" -ForegroundColor White
Write-Host ""
Write-Host "Caminho real da API:" -ForegroundColor Yellow
Write-Host "  response.data.transactions (ou response.data.data.transactions)" -ForegroundColor White
