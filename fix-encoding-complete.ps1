# Script completo para corrigir encoding em todo o projeto
# Converte todos os arquivos para UTF-8 sem BOM

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CORRECAO COMPLETA DE ENCODING UTF-8  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"
$filesFixed = 0
$filesSkipped = 0
$errors = 0

# Extensões de arquivos para processar
$extensions = @(
    "*.ts", "*.tsx", "*.js", "*.jsx", 
    "*.json", "*.html", "*.css", 
    "*.md", "*.txt", "*.yml", "*.yaml"
)

# Pastas para ignorar
$excludeFolders = @(
    "node_modules", 
    "dist", 
    ".git", 
    ".vs", 
    ".vscode"
)

Write-Host "Procurando arquivos para corrigir..." -ForegroundColor Yellow
Write-Host ""

foreach ($ext in $extensions) {
    Write-Host "Processando arquivos: $ext" -ForegroundColor Cyan
    
    $files = Get-ChildItem -Path "." -Filter $ext -Recurse -File -ErrorAction SilentlyContinue | 
        Where-Object { 
            $exclude = $false
            foreach ($folder in $excludeFolders) {
                if ($_.FullName -like "*\$folder\*") {
                    $exclude = $true
                    break
                }
            }
            -not $exclude
        }
    
    foreach ($file in $files) {
        try {
            # Ler conteúdo do arquivo
            $content = Get-Content -Path $file.FullName -Raw -ErrorAction Stop
            
            if ($null -ne $content) {
                # Salvar como UTF-8 sem BOM
                $utf8NoBom = New-Object System.Text.UTF8Encoding $false
                [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
                
                Write-Host "  [OK] $($file.Name)" -ForegroundColor Green
                $filesFixed++
            } else {
                Write-Host "  [SKIP] $($file.Name) (vazio)" -ForegroundColor Gray
                $filesSkipped++
            }
        }
        catch {
            Write-Host "  [ERRO] $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
            $errors++
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESULTADO FINAL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Arquivos corrigidos: $filesFixed" -ForegroundColor Green
Write-Host "Arquivos ignorados: $filesSkipped" -ForegroundColor Yellow
Write-Host "Erros encontrados: $errors" -ForegroundColor Red
Write-Host ""

if ($errors -eq 0) {
    Write-Host "SUCESSO! Todos os arquivos foram convertidos para UTF-8." -ForegroundColor Green
} else {
    Write-Host "ATENCAO! Alguns arquivos apresentaram erros." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
