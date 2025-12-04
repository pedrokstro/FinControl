# Script para testar a API do FinControl

Write-Host "🧪 Testando API FinControl" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""

# 1. Login
Write-Host "1️⃣  Fazendo login com usuário demo..." -ForegroundColor Yellow
$loginBody = @{
    email = "demo@financeiro.com"
    password = "demo123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody

Write-Host "✅ Login realizado com sucesso!" -ForegroundColor Green
Write-Host "👤 Usuário: $($loginResponse.data.user.name)" -ForegroundColor White
Write-Host "📧 Email: $($loginResponse.data.user.email)" -ForegroundColor White
Write-Host ""

$token = $loginResponse.data.accessToken

# 2. Obter Dashboard
Write-Host "2️⃣  Obtendo dados do dashboard..." -ForegroundColor Yellow
$headers = @{
    Authorization = "Bearer $token"
}

$dashboardResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/dashboard" `
    -Method GET `
    -Headers $headers

Write-Host "✅ Dashboard obtido com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "💰 Resumo Financeiro:" -ForegroundColor Cyan
Write-Host "   Receitas: R$ $($dashboardResponse.data.summary.income)" -ForegroundColor Green
Write-Host "   Despesas: R$ $($dashboardResponse.data.summary.expense)" -ForegroundColor Red
Write-Host "   Saldo: R$ $($dashboardResponse.data.summary.balance)" -ForegroundColor Yellow
Write-Host ""

# 3. Listar Categorias
Write-Host "3️⃣  Listando categorias..." -ForegroundColor Yellow
$categoriesResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/categories" `
    -Method GET `
    -Headers $headers

Write-Host "✅ $($categoriesResponse.data.Count) categorias encontradas!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Categorias:" -ForegroundColor Cyan
foreach ($category in $categoriesResponse.data | Select-Object -First 5) {
    $typeEmoji = if ($category.type -eq "income") { "💰" } else { "💸" }
    Write-Host "   $typeEmoji $($category.name) - $($category.color)" -ForegroundColor White
}
Write-Host ""

# 4. Listar Transações
Write-Host "4️⃣  Listando transações..." -ForegroundColor Yellow
$transactionsResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/transactions?limit=5" `
    -Method GET `
    -Headers $headers

Write-Host "✅ $($transactionsResponse.data.total) transações encontradas!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Últimas Transações:" -ForegroundColor Cyan
foreach ($transaction in $transactionsResponse.data.transactions) {
    $typeEmoji = if ($transaction.type -eq "income") { "💰" } else { "💸" }
    $date = ([DateTime]$transaction.date).ToString("dd/MM/yyyy")
    Write-Host "   $typeEmoji R$ $($transaction.amount) - $($transaction.description) ($date)" -ForegroundColor White
}
Write-Host ""

Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host "🎉 Teste concluído com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "🔑 Seu Access Token:" -ForegroundColor Yellow
Write-Host $token -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Use este token para testar outros endpoints no Swagger:" -ForegroundColor Cyan
Write-Host "   http://localhost:5000/api-docs" -ForegroundColor White
Write-Host ""
