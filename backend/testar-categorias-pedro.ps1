# Script para testar API de categorias do Pedro
$baseUrl = "http://localhost:5000/api/v1"

Write-Host "=== TESTE DE CATEGORIAS - PEDRO CASTRO ===" -ForegroundColor Cyan
Write-Host ""

# Login
Write-Host "Fazendo login..." -ForegroundColor Yellow
$loginBody = @{
    email = "pedrocastro767@gmail.com"
    password = "C0po4545@#"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.accessToken
    Write-Host "Login OK!" -ForegroundColor Green
    Write-Host ""
    
    # Buscar categorias
    Write-Host "Buscando categorias..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $categoriesResponse = Invoke-RestMethod -Uri "$baseUrl/categories" -Method GET -Headers $headers
    
    Write-Host ""
    Write-Host "=== RESULTADO ===" -ForegroundColor Cyan
    Write-Host "Total de categorias: $($categoriesResponse.data.Count)" -ForegroundColor Green
    Write-Host ""
    
    if ($categoriesResponse.data.Count -gt 0) {
        Write-Host "Categorias por tipo:" -ForegroundColor Yellow
        $byType = $categoriesResponse.data | Group-Object -Property type
        foreach ($group in $byType) {
            Write-Host "  $($group.Name): $($group.Count)" -ForegroundColor Gray
        }
        
        Write-Host ""
        Write-Host "Primeiras 10 categorias:" -ForegroundColor Yellow
        $categoriesResponse.data | Select-Object -First 10 | ForEach-Object {
            Write-Host "  [$($_.type)] $($_.name) - $($_.color)" -ForegroundColor Gray
        }
    } else {
        Write-Host "NENHUMA CATEGORIA ENCONTRADA!" -ForegroundColor Red
        Write-Host ""
        Write-Host "O usuario nao tem categorias cadastradas." -ForegroundColor Yellow
        Write-Host "Isso explica por que o select aparece vazio!" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Detalhes: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== CONCLUIDO ===" -ForegroundColor Green
