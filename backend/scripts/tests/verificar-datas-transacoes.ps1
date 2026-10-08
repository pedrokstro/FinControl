# Script para verificar datas das transacoes
$baseUrl = "http://localhost:5000/api/v1"

Write-Host "=== VERIFICACAO DE DATAS DAS TRANSACOES ===" -ForegroundColor Cyan
Write-Host ""

# Fazer login
Write-Host "Fazendo login com demo@financeiro.com..." -ForegroundColor Yellow
$loginBody = @{
    email = "demo@financeiro.com"
    password = "demo123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.accessToken
    Write-Host "Login realizado com sucesso!" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "Erro no login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
}

# Buscar todas as transacoes (sem filtro de data)
Write-Host "Buscando todas as transacoes..." -ForegroundColor Yellow
try {
    $allTransactionsResponse = Invoke-RestMethod -Uri "$baseUrl/transactions?limit=100" -Method GET -Headers $headers
    $allTransactions = $allTransactionsResponse.data
    $total = $allTransactionsResponse.meta.total
    
    Write-Host "Total de transacoes no banco: $total" -ForegroundColor Green
    Write-Host ""
    
    if ($allTransactions.Count -gt 0) {
        Write-Host "=== ANALISE DAS DATAS ===" -ForegroundColor Cyan
        Write-Host ""
        
        # Agrupar por mes/ano
        $byMonth = @{}
        foreach ($t in $allTransactions) {
            $date = [DateTime]::Parse($t.date)
            $monthKey = $date.ToString("yyyy-MM")
            
            if (-not $byMonth.ContainsKey($monthKey)) {
                $byMonth[$monthKey] = @{
                    count = 0
                    income = 0
                    expense = 0
                    transactions = @()
                }
            }
            
            $byMonth[$monthKey].count++
            $byMonth[$monthKey].transactions += $t
            
            if ($t.type -eq "income") {
                $byMonth[$monthKey].income += $t.amount
            } else {
                $byMonth[$monthKey].expense += $t.amount
            }
        }
        
        Write-Host "Transacoes por mes:" -ForegroundColor Yellow
        foreach ($month in ($byMonth.Keys | Sort-Object -Descending)) {
            $data = $byMonth[$month]
            Write-Host "  $month : $($data.count) transacoes" -ForegroundColor Gray
            Write-Host "    Receitas: R$ $($data.income)" -ForegroundColor Green
            Write-Host "    Despesas: R$ $($data.expense)" -ForegroundColor Red
        }
        
        Write-Host ""
        Write-Host "=== NOVEMBRO 2025 ===" -ForegroundColor Cyan
        
        $nov2025 = $byMonth["2025-11"]
        if ($nov2025) {
            Write-Host "Transacoes em novembro 2025: $($nov2025.count)" -ForegroundColor Green
            Write-Host ""
            Write-Host "Detalhes:" -ForegroundColor Yellow
            foreach ($t in $nov2025.transactions) {
                $typeIcon = if ($t.type -eq "income") { "+" } else { "-" }
                Write-Host "  [$typeIcon] $($t.date) - R$ $($t.amount) - $($t.description)" -ForegroundColor Gray
            }
        } else {
            Write-Host "PROBLEMA: Nenhuma transacao em novembro 2025!" -ForegroundColor Red
            Write-Host ""
            Write-Host "As transacoes estao em outros meses." -ForegroundColor Yellow
            Write-Host "A interface esta filtrando por novembro 2025, por isso nao aparece nada." -ForegroundColor Yellow
            Write-Host ""
            Write-Host "SOLUCAO:" -ForegroundColor Cyan
            Write-Host "1. Mudar o mes na interface para um mes que tenha transacoes" -ForegroundColor White
            Write-Host "2. OU atualizar as datas das transacoes para novembro 2025" -ForegroundColor White
        }
        
        Write-Host ""
        Write-Host "=== PRIMEIRAS 5 TRANSACOES ===" -ForegroundColor Cyan
        foreach ($t in ($allTransactions | Select-Object -First 5)) {
            $typeIcon = if ($t.type -eq "income") { "+" } else { "-" }
            $typeColor = if ($t.type -eq "income") { "Green" } else { "Red" }
            Write-Host "[$typeIcon] $($t.date) - R$ $($t.amount)" -ForegroundColor $typeColor
            Write-Host "    $($t.description)" -ForegroundColor Gray
            Write-Host "    Categoria: $($t.category.name)" -ForegroundColor DarkGray
            Write-Host ""
        }
        
    } else {
        Write-Host "Nenhuma transacao encontrada!" -ForegroundColor Red
    }
    
} catch {
    Write-Host "Erro ao buscar transacoes: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Detalhes: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== CONCLUIDO ===" -ForegroundColor Green
