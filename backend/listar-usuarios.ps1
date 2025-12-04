# Script para listar usuarios cadastrados via API
$baseUrl = "http://localhost:5000/api/v1"

Write-Host "=== LISTAGEM DE USUARIOS ===" -ForegroundColor Cyan
Write-Host ""

# Tentar fazer login com usuario admin/demo para obter token
Write-Host "Fazendo login para obter token de acesso..." -ForegroundColor Yellow
$loginBody = @{
    email = "demo@financeiro.com"
    password = "demo123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.accessToken
    $currentUser = $loginResponse.data.user
    Write-Host "Login realizado com sucesso!" -ForegroundColor Green
    Write-Host "Usuario logado: $($currentUser.name) ($($currentUser.email))" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "Erro no login: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Nao foi possivel obter a lista de usuarios via API" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Execute o script SQL para ver os usuarios:" -ForegroundColor Yellow
    Write-Host "  psql -U postgres -d controle_gastos -f listar-usuarios.sql" -ForegroundColor Gray
    exit 1
}

Write-Host "=== INFORMACOES DO USUARIO ATUAL ===" -ForegroundColor Cyan
Write-Host "ID: $($currentUser.id)" -ForegroundColor Gray
Write-Host "Nome: $($currentUser.name)" -ForegroundColor Gray
Write-Host "Email: $($currentUser.email)" -ForegroundColor Gray
Write-Host "Premium: $($currentUser.isPremium)" -ForegroundColor Gray
if ($currentUser.planType) {
    Write-Host "Plano: $($currentUser.planType)" -ForegroundColor Gray
}
Write-Host ""

# Nota: A API nao tem endpoint publico para listar todos os usuarios
# Isso e uma boa pratica de seguranca
Write-Host "=== NOTA ===" -ForegroundColor Yellow
Write-Host "Por questoes de seguranca, a API nao possui endpoint publico" -ForegroundColor Gray
Write-Host "para listar todos os usuarios cadastrados." -ForegroundColor Gray
Write-Host ""
Write-Host "Para ver todos os usuarios, execute o script SQL:" -ForegroundColor Yellow
Write-Host "  psql -U postgres -d controle_gastos -f listar-usuarios.sql" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ou conecte-se ao banco de dados e execute:" -ForegroundColor Yellow
Write-Host "  SELECT id, name, email, isPremium FROM users;" -ForegroundColor Cyan
Write-Host ""

# Tentar alguns usuarios conhecidos
Write-Host "=== TENTANDO LOGIN COM USUARIOS CONHECIDOS ===" -ForegroundColor Cyan
Write-Host ""

$knownUsers = @(
    @{ email = "demo@financeiro.com"; password = "demo123" },
    @{ email = "pedrocastro767@gmail.com"; password = "senha123" }
)

$successfulLogins = @()

foreach ($user in $knownUsers) {
    Write-Host "Testando: $($user.email)..." -ForegroundColor Yellow
    
    $testLoginBody = @{
        email = $user.email
        password = $user.password
    } | ConvertTo-Json
    
    try {
        $testResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $testLoginBody -ContentType "application/json"
        $userData = $testResponse.data.user
        
        Write-Host "  OK - Usuario existe!" -ForegroundColor Green
        Write-Host "    Nome: $($userData.name)" -ForegroundColor Gray
        Write-Host "    ID: $($userData.id)" -ForegroundColor Gray
        Write-Host "    Premium: $($userData.isPremium)" -ForegroundColor Gray
        
        $successfulLogins += @{
            email = $user.email
            name = $userData.name
            id = $userData.id
            isPremium = $userData.isPremium
        }
    } catch {
        if ($_.Exception.Message -like "*401*") {
            Write-Host "  FALHA - Senha incorreta (mas usuario existe)" -ForegroundColor Yellow
        } else {
            Write-Host "  NAO ENCONTRADO - Usuario nao existe" -ForegroundColor Red
        }
    }
    Write-Host ""
}

Write-Host "=== RESUMO ===" -ForegroundColor Cyan
Write-Host "Usuarios encontrados: $($successfulLogins.Count)" -ForegroundColor Green
Write-Host ""

if ($successfulLogins.Count -gt 0) {
    Write-Host "Lista de usuarios confirmados:" -ForegroundColor Yellow
    foreach ($user in $successfulLogins) {
        $premiumBadge = if ($user.isPremium) { "[PREMIUM]" } else { "[FREE]" }
        Write-Host "  $premiumBadge $($user.name) - $($user.email)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "=== CONCLUIDO ===" -ForegroundColor Green
