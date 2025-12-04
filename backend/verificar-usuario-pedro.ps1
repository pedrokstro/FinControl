# Script para verificar transacoes do usuario pedrocastro767@gmail.com
$baseUrl = "http://localhost:5000/api/v1"

Write-Host "=== VERIFICACAO DO USUARIO PEDRO CASTRO ===" -ForegroundColor Cyan
Write-Host ""

# Fazer login
Write-Host "Tentando fazer login com pedrocastro767@gmail.com..." -ForegroundColor Yellow
$loginBody = @{
    email = "pedrocastro767@gmail.com"
    password = "C0po4545@#"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.accessToken
    $user = $loginResponse.data.user
    
    Write-Host "Login realizado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== INFORMACOES DO USUARIO ===" -ForegroundColor Cyan
    Write-Host "ID: $($user.id)" -ForegroundColor Gray
    Write-Host "Nome: $($user.name)" -ForegroundColor Gray
    Write-Host "Email: $($user.email)" -ForegroundColor Gray
    Write-Host "Premium: $($user.isPremium)" -ForegroundColor Gray
    if ($user.planType) {
        Write-Host "Plano: $($user.planType)" -ForegroundColor Gray
    }
    Write-Host ""
    
    # Buscar transacoes
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "Buscando transacoes..." -ForegroundColor Yellow
    $transactionsResponse = Invoke-RestMethod -Uri "$baseUrl/transactions?limit=100" -Method GET -Headers $headers
    $transactions = $transactionsResponse.data
    $total = $transactionsResponse.meta.total
    
    Write-Host ""
    Write-Host "=== TRANSACOES ===" -ForegroundColor Cyan
    Write-Host "Total de transacoes: $total" -ForegroundColor Green
    Write-Host ""
    
    if ($total -gt 0) {
        Write-Host "Lista de transacoes:" -ForegroundColor Yellow
        Write-Host ""
        
        $totalReceitas = 0
        $totalDespesas = 0
        
        foreach ($t in $transactions) {
            $date = [DateTime]::Parse($t.date).ToString("dd/MM/yyyy")
            $typeIcon = if ($t.type -eq "income") { "+" } else { "-" }
            $typeColor = if ($t.type -eq "income") { "Green" } else { "Red" }
            $typeLabel = if ($t.type -eq "income") { "Receita" } else { "Despesa" }
            
            Write-Host "[$typeIcon] $date - R$ $($t.amount)" -ForegroundColor $typeColor
            Write-Host "    $($t.description)" -ForegroundColor Gray
            Write-Host "    Categoria: $($t.category.name)" -ForegroundColor DarkGray
            Write-Host ""
            
            if ($t.type -eq "income") {
                $totalReceitas += [decimal]$t.amount
            } else {
                $totalDespesas += [decimal]$t.amount
            }
        }
        
        Write-Host "=== RESUMO ===" -ForegroundColor Cyan
        Write-Host "Total de Receitas: R$ $totalReceitas" -ForegroundColor Green
        Write-Host "Total de Despesas: R$ $totalDespesas" -ForegroundColor Red
        Write-Host "Saldo: R$ $($totalReceitas - $totalDespesas)" -ForegroundColor $(if ($totalReceitas - $totalDespesas -ge 0) { "Green" } else { "Red" })
        
    } else {
        Write-Host "NENHUMA TRANSACAO ENCONTRADA!" -ForegroundColor Red
        Write-Host ""
        Write-Host "O usuario existe mas nao tem transacoes cadastradas." -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Message -like "*401*") {
        Write-Host ""
        Write-Host "SENHA INCORRETA!" -ForegroundColor Red
        Write-Host "A senha fornecida nao esta correta." -ForegroundColor Yellow
    } elseif ($_.Exception.Message -like "*404*") {
        Write-Host ""
        Write-Host "USUARIO NAO ENCONTRADO!" -ForegroundColor Red
        Write-Host "O email pedrocastro767@gmail.com nao esta cadastrado." -ForegroundColor Yellow
    } else {
        Write-Host "Detalhes: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== CONCLUIDO ===" -ForegroundColor Green
