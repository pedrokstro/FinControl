# Script para testar exclusão de transação via API
$baseUrl = "http://localhost:5000/api/v1"

Write-Host "=== TESTE DE EXCLUSAO VIA API ===" -ForegroundColor Cyan
Write-Host ""

# Login
Write-Host "1. Fazendo login..." -ForegroundColor Yellow
$loginBody = @{
    email = "demo@financeiro.com"
    password = "demo123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.accessToken
    Write-Host "   Login OK!" -ForegroundColor Green
    Write-Host ""
    
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    # Listar transações ANTES
    Write-Host "2. Listando transações ANTES da exclusão..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "$baseUrl/transactions?limit=100" -Method GET -Headers $headers
    $totalAntes = $response.meta.total
    Write-Host "   Total de transações: $totalAntes" -ForegroundColor Green
    
    if ($response.data.Count -eq 0) {
        Write-Host "   Nenhuma transação para excluir!" -ForegroundColor Red
        exit
    }
    
    # Pegar primeira transação
    $transacao = $response.data[0]
    $idParaExcluir = $transacao.id
    $descricao = $transacao.description
    $valor = $transacao.amount
    
    Write-Host ""
    Write-Host "3. Transação selecionada para exclusão:" -ForegroundColor Yellow
    Write-Host "   ID: $idParaExcluir" -ForegroundColor Cyan
    Write-Host "   Descrição: $descricao" -ForegroundColor Cyan
    Write-Host "   Valor: R$ $valor" -ForegroundColor Cyan
    Write-Host ""
    
    # Excluir transação
    Write-Host "4. Excluindo transação via API..." -ForegroundColor Yellow
    try {
        $deleteResponse = Invoke-RestMethod -Uri "$baseUrl/transactions/$idParaExcluir" -Method DELETE -Headers $headers
        Write-Host "   Transação excluída com sucesso!" -ForegroundColor Green
    } catch {
        Write-Host "   ERRO ao excluir: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "   Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        exit
    }
    
    Write-Host ""
    
    # Listar transações DEPOIS
    Write-Host "5. Listando transações DEPOIS da exclusão..." -ForegroundColor Yellow
    $responseDepois = Invoke-RestMethod -Uri "$baseUrl/transactions?limit=100" -Method GET -Headers $headers
    $totalDepois = $responseDepois.meta.total
    Write-Host "   Total de transações: $totalDepois" -ForegroundColor Green
    Write-Host ""
    
    # Verificar se foi excluída
    Write-Host "6. Verificação:" -ForegroundColor Yellow
    if ($totalDepois -eq ($totalAntes - 1)) {
        Write-Host "   ✅ Transação foi EXCLUÍDA com sucesso!" -ForegroundColor Green
        Write-Host "   Antes: $totalAntes | Depois: $totalDepois" -ForegroundColor Green
    } else {
        Write-Host "   ❌ ERRO: Transação NÃO foi excluída!" -ForegroundColor Red
        Write-Host "   Antes: $totalAntes | Depois: $totalDepois" -ForegroundColor Red
    }
    
    Write-Host ""
    
    # Tentar buscar a transação excluída
    Write-Host "7. Tentando buscar a transação excluída..." -ForegroundColor Yellow
    try {
        $busca = Invoke-RestMethod -Uri "$baseUrl/transactions/$idParaExcluir" -Method GET -Headers $headers
        Write-Host "   ❌ ERRO: Transação ainda existe no banco!" -ForegroundColor Red
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 404) {
            Write-Host "   ✅ Transação não encontrada (404) - Excluída corretamente!" -ForegroundColor Green
        } else {
            Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
    
} catch {
    Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== TESTE CONCLUIDO ===" -ForegroundColor Cyan
