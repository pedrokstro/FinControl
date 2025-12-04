# Script para testar criacao de transacao
$baseUrl = "http://localhost:5000/api/v1"

Write-Host "=== TESTE DE CRIACAO DE TRANSACAO ===" -ForegroundColor Cyan
Write-Host ""

# 1. Fazer login
Write-Host "1. Fazendo login com demo@financeiro.com..." -ForegroundColor Yellow
$loginBody = @{
    email = "demo@financeiro.com"
    password = "demo123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.accessToken
    Write-Host "Login realizado com sucesso!" -ForegroundColor Green
    Write-Host "Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "Erro no login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Buscar categorias do usuario
Write-Host "2. Buscando categorias..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $categoriesResponse = Invoke-RestMethod -Uri "$baseUrl/categories" -Method GET -Headers $headers
    $categories = $categoriesResponse.data
    Write-Host "Categorias encontradas: $($categories.Count)" -ForegroundColor Green
    
    if ($categories.Count -gt 0) {
        $firstCategory = $categories[0]
        Write-Host "  - Usando categoria: $($firstCategory.name) (ID: $($firstCategory.id))" -ForegroundColor Gray
    } else {
        Write-Host "Nenhuma categoria encontrada. Crie uma categoria primeiro!" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
} catch {
    Write-Host "Erro ao buscar categorias: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 3. Criar uma transacao
Write-Host "3. Criando transacao de teste..." -ForegroundColor Yellow
$transactionBody = @{
    type = "expense"
    amount = 150.50
    description = "Teste de transacao - $(Get-Date -Format 'HH:mm:ss')"
    date = (Get-Date).ToString("yyyy-MM-dd")
    categoryId = $firstCategory.id
} | ConvertTo-Json

Write-Host "Dados da transacao:" -ForegroundColor Gray
Write-Host $transactionBody -ForegroundColor Gray
Write-Host ""

try {
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/transactions" -Method POST -Body $transactionBody -Headers $headers -ContentType "application/json"
    $newTransaction = $createResponse.data
    Write-Host "Transacao criada com sucesso!" -ForegroundColor Green
    Write-Host "  - ID: $($newTransaction.id)" -ForegroundColor Gray
    Write-Host "  - Descricao: $($newTransaction.description)" -ForegroundColor Gray
    Write-Host "  - Valor: R$ $($newTransaction.amount)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "Erro ao criar transacao: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Detalhes: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

# 4. Buscar todas as transacoes
Write-Host "4. Buscando todas as transacoes..." -ForegroundColor Yellow
try {
    $allTransactionsResponse = Invoke-RestMethod -Uri "$baseUrl/transactions" -Method GET -Headers $headers
    $allTransactions = $allTransactionsResponse.data
    Write-Host "Total de transacoes encontradas: $($allTransactionsResponse.meta.total)" -ForegroundColor Green
    
    if ($allTransactions.Count -gt 0) {
        Write-Host ""
        Write-Host "Ultimas transacoes:" -ForegroundColor Cyan
        foreach ($t in $allTransactions | Select-Object -First 5) {
            Write-Host "  - [$($t.type)] R$ $($t.amount) - $($t.description)" -ForegroundColor Gray
        }
    }
    Write-Host ""
} catch {
    Write-Host "Erro ao buscar transacoes: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 5. Verificar se a transacao especifica existe
Write-Host "5. Verificando se a transacao criada existe..." -ForegroundColor Yellow
try {
    $specificTransactionResponse = Invoke-RestMethod -Uri "$baseUrl/transactions/$($newTransaction.id)" -Method GET -Headers $headers
    Write-Host "Transacao encontrada no banco!" -ForegroundColor Green
    Write-Host "  - ID: $($specificTransactionResponse.data.id)" -ForegroundColor Gray
    Write-Host "  - Descricao: $($specificTransactionResponse.data.description)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "Transacao NAO encontrada no banco!" -ForegroundColor Red
    exit 1
}

Write-Host "=== TESTE CONCLUIDO COM SUCESSO ===" -ForegroundColor Green
