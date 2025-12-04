# Script para converter TODOS os arquivos do projeto para UTF-8 sem BOM
# Foco especial em arquivos TypeScript/JavaScript

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CONVERSAO UTF-8 - PROJETO COMPLETO   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"
$filesFixed = 0
$filesWithErrors = 0

# Arquivos críticos que precisam ser corrigidos
$criticalFiles = @(
    "src\pages\Categories.tsx",
    "src\pages\Dashboard.tsx",
    "src\pages\Transactions.tsx",
    "src\pages\Reports.tsx",
    "src\pages\Settings.tsx",
    "src\pages\Profile.tsx",
    "src\pages\Login.tsx",
    "src\store\financialStore.ts",
    "src\store\authStore.ts",
    "src\contexts\ThemeContext.tsx",
    "src\data\mockData.ts",
    "src\App.tsx",
    "src\main.tsx"
)

Write-Host "Convertendo arquivos criticos..." -ForegroundColor Yellow
Write-Host ""

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        try {
            Write-Host "Processando: $file" -ForegroundColor Cyan
            
            # Tentar ler com diferentes encodings
            $content = $null
            
            # Tentar UTF-8 primeiro
            try {
                $content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)
            } catch {
                # Se falhar, tentar Default (ANSI/Windows-1252)
                try {
                    $content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::Default)
                } catch {
                    # Se falhar, tentar ASCII
                    $content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::ASCII)
                }
            }
            
            if ($null -ne $content -and $content.Length -gt 0) {
                # Salvar como UTF-8 sem BOM
                $utf8NoBom = New-Object System.Text.UTF8Encoding $false
                [System.IO.File]::WriteAllText((Resolve-Path $file).Path, $content, $utf8NoBom)
                
                Write-Host "  [OK] Convertido com sucesso" -ForegroundColor Green
                $filesFixed++
            } else {
                Write-Host "  [AVISO] Arquivo vazio ou nao pode ser lido" -ForegroundColor Yellow
            }
        }
        catch {
            Write-Host "  [ERRO] $($_.Exception.Message)" -ForegroundColor Red
            $filesWithErrors++
        }
    } else {
        Write-Host "  [SKIP] Arquivo nao encontrado: $file" -ForegroundColor Gray
    }
    Write-Host ""
}

# Agora processar todos os outros arquivos .ts, .tsx, .js, .jsx
Write-Host "Processando demais arquivos TypeScript/JavaScript..." -ForegroundColor Yellow
Write-Host ""

$extensions = @("*.ts", "*.tsx", "*.js", "*.jsx")
$excludeFolders = @("node_modules", "dist", ".git", ".vs", ".vscode")

foreach ($ext in $extensions) {
    $files = Get-ChildItem -Path "src" -Filter $ext -Recurse -File -ErrorAction SilentlyContinue | 
        Where-Object { 
            $exclude = $false
            foreach ($folder in $excludeFolders) {
                if ($_.FullName -like "*\$folder\*") {
                    $exclude = $true
                    break
                }
            }
            # Pular arquivos já processados
            $alreadyProcessed = $false
            foreach ($critical in $criticalFiles) {
                if ($_.FullName -like "*$($critical.Replace('\', '\\'))") {
                    $alreadyProcessed = $true
                    break
                }
            }
            -not $exclude -and -not $alreadyProcessed
        }
    
    foreach ($file in $files) {
        try {
            $content = $null
            
            # Tentar ler com diferentes encodings
            try {
                $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
            } catch {
                try {
                    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::Default)
                } catch {
                    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::ASCII)
                }
            }
            
            if ($null -ne $content -and $content.Length -gt 0) {
                $utf8NoBom = New-Object System.Text.UTF8Encoding $false
                [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
                
                Write-Host "  [OK] $($file.Name)" -ForegroundColor Green
                $filesFixed++
            }
        }
        catch {
            Write-Host "  [ERRO] $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
            $filesWithErrors++
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESULTADO FINAL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Arquivos convertidos: $filesFixed" -ForegroundColor Green
Write-Host "Arquivos com erro: $filesWithErrors" -ForegroundColor $(if ($filesWithErrors -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($filesWithErrors -eq 0) {
    Write-Host "SUCESSO TOTAL! Todos os arquivos foram convertidos para UTF-8." -ForegroundColor Green
    Write-Host ""
    Write-Host "Proximos passos:" -ForegroundColor Cyan
    Write-Host "1. Execute: npm run dev" -ForegroundColor White
    Write-Host "2. Verifique a pagina de Categorias" -ForegroundColor White
    Write-Host "3. Os caracteres especiais devem aparecer corretamente" -ForegroundColor White
} else {
    Write-Host "ATENCAO! Alguns arquivos apresentaram erros." -ForegroundColor Yellow
    Write-Host "Revise os arquivos com erro manualmente." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
