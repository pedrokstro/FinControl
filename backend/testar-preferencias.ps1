# Script para testar API de preferências do usuário
$baseUrl = "http://localhost:5000/api/v1"

Write-Host "=== TESTE DE PREFERENCIAS DO USUARIO ===" -ForegroundColor Cyan
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
    Write-Host "   ✅ Login OK!" -ForegroundColor Green
    Write-Host ""
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    # Obter todas as preferências
    Write-Host "2. Obtendo todas as preferências..." -ForegroundColor Yellow
    try {
        $allPrefs = Invoke-RestMethod -Uri "$baseUrl/user-preferences" -Method GET -Headers $headers
        Write-Host "   ✅ Preferências obtidas:" -ForegroundColor Green
        $allPrefs.data | ConvertTo-Json
    } catch {
        Write-Host "   ⚠️ Nenhuma preferência encontrada (normal para novo usuário)" -ForegroundColor Yellow
    }
    Write-Host ""
    
    # Definir tema como light
    Write-Host "3. Definindo tema como 'light'..." -ForegroundColor Yellow
    $themeBody = @{
        value = "light"
    } | ConvertTo-Json
    
    try {
        $setTheme = Invoke-RestMethod -Uri "$baseUrl/user-preferences/theme" -Method PUT -Body $themeBody -Headers $headers
        Write-Host "   ✅ Tema definido como light!" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Erro ao definir tema" -ForegroundColor Red
        Write-Host "   Detalhes: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
    
    # Obter tema
    Write-Host "4. Obtendo tema salvo..." -ForegroundColor Yellow
    try {
        $getTheme = Invoke-RestMethod -Uri "$baseUrl/user-preferences/theme" -Method GET -Headers $headers
        Write-Host "   ✅ Tema atual: $($getTheme.data.value)" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Erro ao obter tema" -ForegroundColor Red
    }
    Write-Host ""
    
    # Definir tema como dark
    Write-Host "5. Definindo tema como 'dark'..." -ForegroundColor Yellow
    $themeBody = @{
        value = "dark"
    } | ConvertTo-Json
    
    try {
        $setTheme = Invoke-RestMethod -Uri "$baseUrl/user-preferences/theme" -Method PUT -Body $themeBody -Headers $headers
        Write-Host "   ✅ Tema definido como dark!" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Erro ao definir tema" -ForegroundColor Red
    }
    Write-Host ""
    
    # Obter tema novamente
    Write-Host "6. Obtendo tema salvo novamente..." -ForegroundColor Yellow
    try {
        $getTheme = Invoke-RestMethod -Uri "$baseUrl/user-preferences/theme" -Method GET -Headers $headers
        Write-Host "   ✅ Tema atual: $($getTheme.data.value)" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Erro ao obter tema" -ForegroundColor Red
    }
    Write-Host ""
    
    # Definir múltiplas preferências
    Write-Host "7. Definindo múltiplas preferências..." -ForegroundColor Yellow
    $multiPrefs = @{
        theme = "light"
        categoriesViewMode = "grid"
    } | ConvertTo-Json
    
    try {
        $setMulti = Invoke-RestMethod -Uri "$baseUrl/user-preferences" -Method POST -Body $multiPrefs -Headers $headers
        Write-Host "   ✅ Preferências definidas!" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Erro ao definir preferências" -ForegroundColor Red
    }
    Write-Host ""
    
    # Obter todas as preferências novamente
    Write-Host "8. Obtendo todas as preferências finais..." -ForegroundColor Yellow
    try {
        $allPrefs = Invoke-RestMethod -Uri "$baseUrl/user-preferences" -Method GET -Headers $headers
        Write-Host "   ✅ Preferências finais:" -ForegroundColor Green
        $allPrefs.data | ConvertTo-Json
    } catch {
        Write-Host "   ❌ Erro ao obter preferências" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ ERRO: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Resposta: $responseBody" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== TESTE CONCLUÍDO ===" -ForegroundColor Cyan
