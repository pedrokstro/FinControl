# Script para testar criação de transação
$baseUrl = "http://localhost:5000/api/v1"

Write-Host "=== TESTE DE CRIAÇÃO DE TRANSAÇÃO ===" -ForegroundColor Cyan
Write-Host ""

# 1. Fazer login
Write-Host "1. Fazendo login com pedrocastro767@gmail.com..." -ForegroundColor Yellow
$loginBody = @{
    email = "pedrocastro767@gmail.com"
    password = "senha123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.accessToken
    Write-Host "✓ Login realizado com sucesso!" -ForegroundColor Green
    Write-Host "Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ Erro no login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Buscar categorias do usuário
Write-Host "2. Buscando categorias..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $categoriesResponse = Invoke-RestMethod -Uri "$baseUrl/categories" -Method GET -Headers $headers
    $categories = $categoriesResponse.data
    Write-Host "✓ Categorias encontradas: $($categories.Count)" -ForegroundColor Green
    
    if ($categories.Count -gt 0) {
        $firstCategory = $categories[0]
        Write-Host "  - Usando categoria: $($firstCategory.name) (ID: $($firstCategory.id))" -ForegroundColor Gray
    } else {
        Write-Host "✗ Nenhuma categoria encontrada. Crie uma categoria primeiro!" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
} catch {
    Write-Host "✗ Erro ao buscar categorias: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 3. Criar uma transação
Write-Host "3. Criando transação de teste..." -ForegroundColor Yellow
$transactionBody = @{
    type = "expense"
    amount = 150.50
    description = "Teste de transação - $(Get-Date -Format 'HH:mm:ss')"
    date = (Get-Date).ToString("yyyy-MM-dd")
    categoryId = $firstCategory.id
} | ConvertTo-Json

Write-Host "Dados da transação:" -ForegroundColor Gray
Write-Host $transactionBody -ForegroundColor Gray
Write-Host ""

try {
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/transactions" -Method POST -Body $transactionBody -Headers $headers -ContentType "application/json"
    $newTransaction = $createResponse.data
    Write-Host "✓ Transação criada com sucesso!" -ForegroundColor Green
    Write-Host "  - ID: $($newTransaction.id)" -ForegroundColor Gray
    Write-Host "  - Descrição: $($newTransaction.description)" -ForegroundColor Gray
    Write-Host "  - Valor: R$ $($newTransaction.amount)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ Erro ao criar transação: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Detalhes: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

# 4. Buscar todas as transações
Write-Host "4. Buscando todas as transações..." -ForegroundColor Yellow
try {
    $allTransactionsResponse = Invoke-RestMethod -Uri "$baseUrl/transactions" -Method GET -Headers $headers
    $allTransactions = $allTransactionsResponse.data
    Write-Host "✓ Total de transações encontradas: $($allTransactionsResponse.meta.total)" -ForegroundColor Green
    
    if ($allTransactions.Count -gt 0) {
        Write-Host ""
        Write-Host "Últimas transações:" -ForegroundColor Cyan
        foreach ($t in $allTransactions | Select-Object -First 5) {
            Write-Host "  - [$($t.type)] R$ $($t.amount) - $($t.description)" -ForegroundColor Gray
        }
    }
    Write-Host ""
} catch {
    Write-Host "✗ Erro ao buscar transações: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 5. Verificar se a transação específica existe
Write-Host "5. Verificando se a transação criada existe..." -ForegroundColor Yellow
try {
    $specificTransactionResponse = Invoke-RestMethod -Uri "$baseUrl/transactions/$($newTransaction.id)" -Method GET -Headers $headers
    Write-Host "✓ Transação encontrada no banco!" -ForegroundColor Green
    Write-Host "  - ID: $($specificTransactionResponse.data.id)" -ForegroundColor Gray
    Write-Host "  - Descrição: $($specificTransactionResponse.data.description)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ Transação NÃO encontrada no banco!" -ForegroundColor Red
    exit 1
}

Write-Host "=== TESTE CONCLUIDO COM SUCESSO ===" -ForegroundColor Green
