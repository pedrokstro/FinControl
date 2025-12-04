# Script para resetar senha de usuario ou criar novo usuario
param(
    [string]$email = "pedrocastro767@gmail.com",
    [string]$novaSenha = "senha123"
)

Write-Host "=== RESETAR/CRIAR USUARIO ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Email: $email" -ForegroundColor Yellow
Write-Host "Nova senha: $novaSenha" -ForegroundColor Yellow
Write-Host ""

# Nota: A API nao tem endpoint de reset de senha publico
# Vamos tentar criar um novo usuario com este email
# Se ja existir, vai dar erro 409

$baseUrl = "http://localhost:5000/api/v1"

Write-Host "Tentando criar usuario..." -ForegroundColor Yellow

$registerBody = @{
    name = "Pedro Castro"
    email = $email
    password = $novaSenha
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "Usuario criado com sucesso!" -ForegroundColor Green
    Write-Host "ID: $($response.data.user.id)" -ForegroundColor Gray
    Write-Host "Nome: $($response.data.user.name)" -ForegroundColor Gray
    Write-Host "Email: $($response.data.user.email)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Credenciais:" -ForegroundColor Cyan
    Write-Host "  Email: $email" -ForegroundColor White
    Write-Host "  Senha: $novaSenha" -ForegroundColor White
} catch {
    $errorMessage = $_.Exception.Message
    $errorDetails = $_.ErrorDetails.Message
    
    if ($errorDetails -like "*já cadastrado*" -or $errorDetails -like "*already exists*") {
        Write-Host "Usuario ja existe no banco de dados!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Para resetar a senha, voce precisa:" -ForegroundColor Yellow
        Write-Host "1. Conectar diretamente ao banco de dados PostgreSQL" -ForegroundColor Gray
        Write-Host "2. Executar o seguinte SQL:" -ForegroundColor Gray
        Write-Host ""
        
        # Gerar hash bcrypt da senha (exemplo)
        Write-Host "-- Resetar senha do usuario" -ForegroundColor Cyan
        Write-Host "UPDATE users" -ForegroundColor Cyan
        Write-Host "SET password = crypt('$novaSenha', gen_salt('bf'))" -ForegroundColor Cyan
        Write-Host "WHERE email = '$email';" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "OU use a extensao pgcrypto:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "-- Primeiro, habilite a extensao (se ainda nao estiver)" -ForegroundColor Cyan
        Write-Host "CREATE EXTENSION IF NOT EXISTS pgcrypto;" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "-- Depois, atualize a senha" -ForegroundColor Cyan
        Write-Host "UPDATE users" -ForegroundColor Cyan
        Write-Host "SET password = crypt('$novaSenha', gen_salt('bf'))" -ForegroundColor Cyan
        Write-Host "WHERE email = '$email';" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Comando para conectar ao PostgreSQL:" -ForegroundColor Yellow
        Write-Host "  psql -U postgres -d controle_gastos" -ForegroundColor Gray
    } else {
        Write-Host "Erro ao criar usuario: $errorMessage" -ForegroundColor Red
        Write-Host "Detalhes: $errorDetails" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== USUARIOS CONHECIDOS ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. demo@financeiro.com / demo123 [PREMIUM]" -ForegroundColor Green
Write-Host "2. pedrocastro767@gmail.com / senha123 (verificar)" -ForegroundColor Yellow
