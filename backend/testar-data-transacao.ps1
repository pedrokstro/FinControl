# Script para testar formato de data da transação
$baseUrl = "http://localhost:5000/api/v1"

Write-Host "=== TESTE DE FORMATO DE DATA ===" -ForegroundColor Cyan
Write-Host ""

# Login
$loginBody = @{
    email = "demo@financeiro.com"
    password = "demo123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.accessToken
    
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    # Buscar transações
    $response = Invoke-RestMethod -Uri "$baseUrl/transactions?limit=10" -Method GET -Headers $headers
    $transactions = $response.data
    
    if ($transactions.Count -gt 0) {
        $t = $transactions[0]
        
        Write-Host "Transação encontrada:" -ForegroundColor Green
        Write-Host "  ID: $($t.id)" -ForegroundColor White
        Write-Host "  Descrição: $($t.description)" -ForegroundColor White
        Write-Host "  Valor: R$ $($t.amount)" -ForegroundColor White
        Write-Host ""
        Write-Host "FORMATO DA DATA:" -ForegroundColor Yellow
        Write-Host "  date: $($t.date)" -ForegroundColor Cyan
        Write-Host "  Tipo: $($t.date.GetType().Name)" -ForegroundColor Cyan
        Write-Host ""
        
        # Tentar parsear a data
        $dateObj = [DateTime]::Parse($t.date)
        Write-Host "Data parseada:" -ForegroundColor Yellow
        Write-Host "  DateTime: $dateObj" -ForegroundColor Cyan
        Write-Host "  Ano: $($dateObj.Year)" -ForegroundColor Cyan
        Write-Host "  Mês: $($dateObj.Month)" -ForegroundColor Cyan
        Write-Host "  Dia: $($dateObj.Day)" -ForegroundColor Cyan
        Write-Host ""
        
        # Verificar se está em novembro 2025
        $isNovembro2025 = $dateObj.Year -eq 2025 -and $dateObj.Month -eq 11
        Write-Host "Está em novembro 2025? $isNovembro2025" -ForegroundColor $(if ($isNovembro2025) { "Green" } else { "Red" })
        
    } else {
        Write-Host "Nenhuma transação encontrada!" -ForegroundColor Red
    }
    
} catch {
    Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Red
}
