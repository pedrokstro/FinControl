# Script para testar criação de categoria via API
$baseUrl = "http://localhost:5000/api/v1"

Write-Host "=== TESTE DE CRIACAO DE CATEGORIA ===" -ForegroundColor Cyan
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
        "Content-Type" = "application/json"
    }
    
    # Listar categorias ANTES
    Write-Host "2. Listando categorias ANTES..." -ForegroundColor Yellow
    $responseAntes = Invoke-RestMethod -Uri "$baseUrl/categories" -Method GET -Headers $headers
    $totalAntes = $responseAntes.data.Count
    Write-Host "   Total de categorias: $totalAntes" -ForegroundColor Green
    Write-Host ""
    
    # Criar nova categoria
    Write-Host "3. Criando nova categoria..." -ForegroundColor Yellow
    $novaCategoria = @{
        name = "Teste API"
        type = "expense"
        color = "#FF5733"
        icon = "TestTube"
    } | ConvertTo-Json
    
    $categoriaResponse = Invoke-RestMethod -Uri "$baseUrl/categories" -Method POST -Body $novaCategoria -Headers $headers
    $categoriaId = $categoriaResponse.data.id
    Write-Host "   Categoria criada!" -ForegroundColor Green
    Write-Host "   ID: $categoriaId" -ForegroundColor Cyan
    Write-Host "   Nome: $($categoriaResponse.data.name)" -ForegroundColor Cyan
    Write-Host ""
    
    # Listar categorias DEPOIS
    Write-Host "4. Listando categorias DEPOIS..." -ForegroundColor Yellow
    $responseDepois = Invoke-RestMethod -Uri "$baseUrl/categories" -Method GET -Headers $headers
    $totalDepois = $responseDepois.data.Count
    Write-Host "   Total de categorias: $totalDepois" -ForegroundColor Green
    Write-Host ""
    
    # Verificar se foi criada
    Write-Host "5. Verificação:" -ForegroundColor Yellow
    if ($totalDepois -eq ($totalAntes + 1)) {
        Write-Host "   ✅ Categoria foi CRIADA com sucesso!" -ForegroundColor Green
        Write-Host "   Antes: $totalAntes | Depois: $totalDepois" -ForegroundColor Green
    } else {
        Write-Host "   ❌ ERRO: Categoria NÃO foi criada!" -ForegroundColor Red
        Write-Host "   Antes: $totalAntes | Depois: $totalDepois" -ForegroundColor Red
    }
    
    Write-Host ""
    
    # Buscar a categoria criada
    Write-Host "6. Buscando categoria criada..." -ForegroundColor Yellow
    try {
        $busca = Invoke-RestMethod -Uri "$baseUrl/categories/$categoriaId" -Method GET -Headers $headers
        Write-Host "   ✅ Categoria encontrada no banco!" -ForegroundColor Green
        Write-Host "   Nome: $($busca.data.name)" -ForegroundColor Cyan
        Write-Host "   Tipo: $($busca.data.type)" -ForegroundColor Cyan
        Write-Host "   Cor: $($busca.data.color)" -ForegroundColor Cyan
    } catch {
        Write-Host "   ❌ Categoria não encontrada!" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "7. Limpando - Excluindo categoria de teste..." -ForegroundColor Yellow
    try {
        Invoke-RestMethod -Uri "$baseUrl/categories/$categoriaId" -Method DELETE -Headers $headers | Out-Null
        Write-Host "   ✅ Categoria de teste excluída!" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️ Erro ao excluir categoria de teste" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Resposta: $responseBody" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== TESTE CONCLUIDO ===" -ForegroundColor Cyan
