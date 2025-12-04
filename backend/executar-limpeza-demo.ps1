# Script para executar a limpeza de transações do usuário demo
# Requer psql instalado

$dbHost = "localhost"
$dbPort = "5432"
$dbName = "fincontrol_db"
$dbUser = "postgres"
$dbPassword = "360106"

Write-Host "=== LIMPEZA DE TRANSACOES DO USUARIO DEMO ===" -ForegroundColor Cyan
Write-Host ""

# Definir variável de ambiente para senha
$env:PGPASSWORD = $dbPassword

Write-Host "1. Verificando quantas transações existem..." -ForegroundColor Yellow

# Contar transações antes
$countQuery = @"
SELECT COUNT(*) FROM transactions 
WHERE "userId" = (SELECT id FROM users WHERE email = 'demo@financeiro.com');
"@

try {
    $totalAntes = psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -t -c $countQuery
    $totalAntes = $totalAntes.Trim()
    Write-Host "   Total de transações: $totalAntes" -ForegroundColor Green
    Write-Host ""
    
    if ($totalAntes -eq "0") {
        Write-Host "   Nenhuma transação para excluir!" -ForegroundColor Yellow
        exit
    }
    
    # Confirmar exclusão
    Write-Host "2. ATENÇÃO: Isso irá excluir TODAS as $totalAntes transações!" -ForegroundColor Red
    $confirmacao = Read-Host "   Deseja continuar? (S/N)"
    
    if ($confirmacao -ne "S" -and $confirmacao -ne "s") {
        Write-Host "   Operação cancelada." -ForegroundColor Yellow
        exit
    }
    
    Write-Host ""
    Write-Host "3. Excluindo transações..." -ForegroundColor Yellow
    
    # Excluir transações
    $deleteQuery = @"
DELETE FROM transactions 
WHERE "userId" = (SELECT id FROM users WHERE email = 'demo@financeiro.com');
"@
    
    psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -c $deleteQuery | Out-Null
    Write-Host "   Transações excluídas!" -ForegroundColor Green
    Write-Host ""
    
    # Contar transações depois
    Write-Host "4. Verificando resultado..." -ForegroundColor Yellow
    $totalDepois = psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -t -c $countQuery
    $totalDepois = $totalDepois.Trim()
    
    if ($totalDepois -eq "0") {
        Write-Host "   ✅ SUCESSO! Todas as transações foram excluídas!" -ForegroundColor Green
        Write-Host "   Antes: $totalAntes | Depois: $totalDepois" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ ATENÇÃO: Ainda restam $totalDepois transações!" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Certifique-se de que:" -ForegroundColor Yellow
    Write-Host "  1. PostgreSQL está rodando" -ForegroundColor White
    Write-Host "  2. psql está instalado e no PATH" -ForegroundColor White
    Write-Host "  3. As credenciais estão corretas" -ForegroundColor White
} finally {
    # Limpar variável de ambiente
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "=== CONCLUIDO ===" -ForegroundColor Cyan
