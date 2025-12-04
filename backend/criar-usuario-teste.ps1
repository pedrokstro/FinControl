# Script para criar usuario de teste
$baseUrl = "http://localhost:5000/api/v1"

Write-Host "=== CRIACAO DE USUARIO DE TESTE ===" -ForegroundColor Cyan
Write-Host ""

# Dados do usuario
$registerBody = @{
    name = "Pedro Castro"
    email = "pedrocastro767@gmail.com"
    password = "senha123"
} | ConvertTo-Json

Write-Host "Tentando criar usuario: pedrocastro767@gmail.com" -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "Usuario criado com sucesso!" -ForegroundColor Green
    Write-Host "ID: $($response.data.user.id)" -ForegroundColor Gray
    Write-Host "Nome: $($response.data.user.name)" -ForegroundColor Gray
    Write-Host "Email: $($response.data.user.email)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Token de acesso gerado:" -ForegroundColor Gray
    Write-Host $response.data.accessToken.Substring(0, 50) -ForegroundColor DarkGray
} catch {
    $errorMessage = $_.Exception.Message
    $errorDetails = $_.ErrorDetails.Message
    
    if ($errorDetails -like "*já existe*" -or $errorDetails -like "*already exists*") {
        Write-Host "Usuario ja existe no banco de dados!" -ForegroundColor Yellow
        Write-Host "Tentando fazer login..." -ForegroundColor Yellow
        Write-Host ""
        
        # Tentar login
        $loginBody = @{
            email = "pedrocastro767@gmail.com"
            password = "senha123"
        } | ConvertTo-Json
        
        try {
            $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
            Write-Host "Login realizado com sucesso!" -ForegroundColor Green
            Write-Host "ID: $($loginResponse.data.user.id)" -ForegroundColor Gray
            Write-Host "Nome: $($loginResponse.data.user.name)" -ForegroundColor Gray
            Write-Host "Email: $($loginResponse.data.user.email)" -ForegroundColor Gray
        } catch {
            Write-Host "Erro no login: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "Detalhes: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "Erro ao criar usuario: $errorMessage" -ForegroundColor Red
        Write-Host "Detalhes: $errorDetails" -ForegroundColor Red
    }
}
