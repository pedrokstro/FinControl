# Script para corrigir encoding do arquivo Categories.tsx

Write-Host "Corrigindo encoding de Categories.tsx..." -ForegroundColor Cyan

$file = "src\pages\Categories.tsx"

try {
    # Ler o conteúdo do arquivo
    $content = Get-Content -Path $file -Raw -Encoding UTF8
    
    # Salvar como UTF-8 sem BOM
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText((Resolve-Path $file), $content, $utf8NoBom)
    
    Write-Host "Arquivo corrigido com sucesso!" -ForegroundColor Green
}
catch {
    Write-Host "Erro ao corrigir arquivo: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
