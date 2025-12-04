# Script detalhado para verificar transacoes do Pedro
$baseUrl = "http://localhost:5000/api/v1"

Write-Host "=== VERIFICACAO DETALHADA - PEDRO CASTRO ===" -ForegroundColor Cyan
Write-Host ""

# Login
$loginBody = @{
    email = "pedrocastro767@gmail.com"
    password = "C0po4545@#"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResponse.data.accessToken
$user = $loginResponse.data.user

Write-Host "Usuario: $($user.name)" -ForegroundColor Green
Write-Host "ID: $($user.id)" -ForegroundColor Gray
Write-Host ""

$headers = @{
    "Authorization" = "Bearer $token"
}

# Buscar transacoes
$response = Invoke-RestMethod -Uri "$baseUrl/transactions?limit=10" -Method GET -Headers $headers

Write-Host "=== ESTRUTURA DA RESPOSTA ===" -ForegroundColor Cyan
Write-Host "Total: $($response.meta.total)" -ForegroundColor Yellow
Write-Host "Transacoes retornadas: $($response.data.Count)" -ForegroundColor Yellow
Write-Host ""

if ($response.data.Count -gt 0) {
    Write-Host "=== PRIMEIRAS 10 TRANSACOES ===" -ForegroundColor Cyan
    Write-Host ""
    
    foreach ($t in $response.data) {
        Write-Host "ID: $($t.id)" -ForegroundColor Gray
        Write-Host "Tipo: $($t.type)" -ForegroundColor $(if ($t.type -eq "income") { "Green" } else { "Red" })
        Write-Host "Valor: $($t.amount) (tipo: $($t.amount.GetType().Name))" -ForegroundColor Yellow
        Write-Host "Descricao: $($t.description)" -ForegroundColor White
        Write-Host "Data: $($t.date)" -ForegroundColor Gray
        Write-Host "Categoria: $($t.category.name)" -ForegroundColor DarkGray
        Write-Host ""
    }
    
    Write-Host "=== ANALISE DOS VALORES ===" -ForegroundColor Cyan
    $valores = $response.data | ForEach-Object { [decimal]$_.amount }
    $total = ($valores | Measure-Object -Sum).Sum
    Write-Host "Soma das 10 primeiras: R$ $total" -ForegroundColor Yellow
    
} else {
    Write-Host "Nenhuma transacao retornada!" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== JSON COMPLETO (primeira transacao) ===" -ForegroundColor Cyan
if ($response.data.Count -gt 0) {
    $response.data[0] | ConvertTo-Json -Depth 3
}
