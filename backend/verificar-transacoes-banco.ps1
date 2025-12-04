# Script para verificar transações no banco de dados
$baseUrl = "http://localhost:5000/api/v1"

Write-Host "=== VERIFICACAO DE TRANSACOES NO BANCO ===" -ForegroundColor Cyan
Write-Host ""

# Login
Write-Host "Fazendo login com usuario demo..." -ForegroundColor Yellow
$loginBody = @{
    email = "demo@financeiro.com"
    password = "demo123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.accessToken
    $userId = $loginResponse.data.user.id
    
    Write-Host "Login OK! User ID: $userId" -ForegroundColor Green
    Write-Host ""
    
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    # Buscar transações via API
    Write-Host "=== TRANSACOES VIA API ===" -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri "$baseUrl/transactions?limit=100" -Method GET -Headers $headers
    $transactions = $response.data
    $totalAPI = $response.meta.total
    
    Write-Host "Total de transacoes (API): $totalAPI" -ForegroundColor Green
    Write-Host ""
    
    if ($transactions.Count -gt 0) {
        Write-Host "Lista de transacoes:" -ForegroundColor Yellow
        Write-Host ""
        
        $transactions | ForEach-Object {
            $date = [DateTime]::Parse($_.date).ToString("dd/MM/yyyy")
            $typeIcon = if ($_.type -eq "income") { "+" } else { "-" }
            $typeColor = if ($_.type -eq "income") { "Green" } else { "Red" }
            
            Write-Host "[$typeIcon] $date - R$ $($_.amount) - $($_.description)" -ForegroundColor $typeColor
            Write-Host "    ID: $($_.id)" -ForegroundColor DarkGray
            Write-Host "    Categoria: $($_.category.name)" -ForegroundColor DarkGray
            Write-Host ""
        }
        
        # Calcular totais
        $totalReceitas = ($transactions | Where-Object { $_.type -eq "income" } | Measure-Object -Property amount -Sum).Sum
        $totalDespesas = ($transactions | Where-Object { $_.type -eq "expense" } | Measure-Object -Property amount -Sum).Sum
        
        Write-Host "=== RESUMO ===" -ForegroundColor Cyan
        Write-Host "Total de Receitas: R$ $totalReceitas" -ForegroundColor Green
        Write-Host "Total de Despesas: R$ $totalDespesas" -ForegroundColor Red
        Write-Host "Saldo: R$ $($totalReceitas - $totalDespesas)" -ForegroundColor $(if ($totalReceitas - $totalDespesas -ge 0) { "Green" } else { "Red" })
        
    } else {
        Write-Host "Nenhuma transacao encontrada!" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "=== INSTRUCOES ===" -ForegroundColor Cyan
    Write-Host "1. Anote o ID de uma transacao acima" -ForegroundColor White
    Write-Host "2. Exclua essa transacao pela interface" -ForegroundColor White
    Write-Host "3. Execute este script novamente" -ForegroundColor White
    Write-Host "4. Verifique se a transacao foi removida" -ForegroundColor White
    
} catch {
    Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Detalhes: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== CONCLUIDO ===" -ForegroundColor Green
