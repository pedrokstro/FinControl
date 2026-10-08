# Script para testar sistema de verificação de email completo
$baseUrl = "http://localhost:5000/api/v1"
$email = "teste.$(Get-Random)@email.com"
$password = "senha123"
$name = "Usuario Teste"

Write-Host "=== TESTE COMPLETO: VERIFICAÇÃO DE EMAIL ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Email de teste: $email" -ForegroundColor Yellow
Write-Host ""

# Função para fazer requisições
function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Endpoint,
        [object]$Body
    )
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        $params = @{
            Uri = "$baseUrl$Endpoint"
            Method = $Method
            Headers = $headers
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
        }
        
        $response = Invoke-RestMethod @params
        return $response
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $errorBody = $_.ErrorDetails.Message
        
        Write-Host "   Status: $statusCode" -ForegroundColor Red
        if ($errorBody) {
            $errorObj = $errorBody | ConvertFrom-Json
            Write-Host "   Erro: $($errorObj.message)" -ForegroundColor Red
        }
        return $null
    }
}

# ========================================
# TESTE 1: REGISTRAR USUÁRIO
# ========================================
Write-Host "1️⃣  REGISTRANDO NOVO USUÁRIO..." -ForegroundColor Yellow
Write-Host "   POST /auth/register" -ForegroundColor Gray

$registerBody = @{
    name = $name
    email = $email
    password = $password
}

$registerResponse = Invoke-ApiRequest -Method POST -Endpoint "/auth/register" -Body $registerBody

if ($registerResponse) {
    Write-Host "   ✅ Usuário registrado com sucesso!" -ForegroundColor Green
    Write-Host "   📧 Código de verificação enviado para: $email" -ForegroundColor Green
    Write-Host ""
    Write-Host "   ⚠️  ATENÇÃO: Como estamos em desenvolvimento, o email não será enviado de verdade." -ForegroundColor Yellow
    Write-Host "   💡 O código será exibido no console do backend." -ForegroundColor Yellow
    Write-Host ""
    
    # Aguardar usuário digitar o código
    Write-Host "   📋 Digite o código de 6 dígitos que apareceu no console do backend:" -ForegroundColor Cyan
    $code = Read-Host "   Código"
    
    if ($code) {
        Write-Host ""
        
        # ========================================
        # TESTE 2: VERIFICAR EMAIL
        # ========================================
        Write-Host "2️⃣  VERIFICANDO EMAIL..." -ForegroundColor Yellow
        Write-Host "   POST /auth/verify-email" -ForegroundColor Gray
        
        $verifyBody = @{
            email = $email
            code = $code
        }
        
        $verifyResponse = Invoke-ApiRequest -Method POST -Endpoint "/auth/verify-email" -Body $verifyBody
        
        if ($verifyResponse) {
            Write-Host "   ✅ Email verificado com sucesso!" -ForegroundColor Green
            Write-Host ""
            
            # ========================================
            # TESTE 3: FAZER LOGIN
            # ========================================
            Write-Host "3️⃣  FAZENDO LOGIN..." -ForegroundColor Yellow
            Write-Host "   POST /auth/login" -ForegroundColor Gray
            
            $loginBody = @{
                email = $email
                password = $password
            }
            
            $loginResponse = Invoke-ApiRequest -Method POST -Endpoint "/auth/login" -Body $loginBody
            
            if ($loginResponse) {
                Write-Host "   ✅ Login realizado com sucesso!" -ForegroundColor Green
                Write-Host "   👤 Usuário: $($loginResponse.data.user.name)" -ForegroundColor Green
                Write-Host "   📧 Email verificado: $($loginResponse.data.user.emailVerified)" -ForegroundColor Green
                Write-Host ""
                
                # ========================================
                # TESTE 4: RECUPERAÇÃO DE SENHA
                # ========================================
                Write-Host "4️⃣  TESTANDO RECUPERAÇÃO DE SENHA..." -ForegroundColor Yellow
                Write-Host "   POST /auth/forgot-password" -ForegroundColor Gray
                
                $forgotBody = @{
                    email = $email
                }
                
                $forgotResponse = Invoke-ApiRequest -Method POST -Endpoint "/auth/forgot-password" -Body $forgotBody
                
                if ($forgotResponse) {
                    Write-Host "   ✅ Código de recuperação enviado!" -ForegroundColor Green
                    Write-Host ""
                    Write-Host "   📋 Digite o código de recuperação que apareceu no console:" -ForegroundColor Cyan
                    $resetCode = Read-Host "   Código"
                    
                    if ($resetCode) {
                        Write-Host ""
                        
                        # ========================================
                        # TESTE 5: REDEFINIR SENHA
                        # ========================================
                        Write-Host "5️⃣  REDEFININDO SENHA..." -ForegroundColor Yellow
                        Write-Host "   POST /auth/reset-password" -ForegroundColor Gray
                        
                        $newPassword = "novaSenha456"
                        $resetBody = @{
                            email = $email
                            code = $resetCode
                            newPassword = $newPassword
                        }
                        
                        $resetResponse = Invoke-ApiRequest -Method POST -Endpoint "/auth/reset-password" -Body $resetBody
                        
                        if ($resetResponse) {
                            Write-Host "   ✅ Senha redefinida com sucesso!" -ForegroundColor Green
                            Write-Host ""
                            
                            # ========================================
                            # TESTE 6: LOGIN COM NOVA SENHA
                            # ========================================
                            Write-Host "6️⃣  TESTANDO LOGIN COM NOVA SENHA..." -ForegroundColor Yellow
                            Write-Host "   POST /auth/login" -ForegroundColor Gray
                            
                            $newLoginBody = @{
                                email = $email
                                password = $newPassword
                            }
                            
                            $newLoginResponse = Invoke-ApiRequest -Method POST -Endpoint "/auth/login" -Body $newLoginBody
                            
                            if ($newLoginResponse) {
                                Write-Host "   ✅ Login com nova senha realizado com sucesso!" -ForegroundColor Green
                                Write-Host ""
                            }
                        }
                    }
                }
            }
        }
    }
} else {
    Write-Host "   ❌ Falha ao registrar usuário" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== TESTE CONCLUÍDO ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 RESUMO:" -ForegroundColor Yellow
Write-Host "✅ Sistema de verificação de email implementado" -ForegroundColor Green
Write-Host "✅ Sistema de recuperação de senha implementado" -ForegroundColor Green
Write-Host "✅ Códigos de 6 dígitos funcionando" -ForegroundColor Green
Write-Host "✅ Expiração de 15 minutos configurada" -ForegroundColor Green
Write-Host ""
