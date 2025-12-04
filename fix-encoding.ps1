# Script para corrigir encoding de arquivos para UTF-8 sem BOM

$files = @(
    "src/pages/Dashboard.tsx",
    "src/pages/Login.tsx",
    "src/pages/Transactions.tsx",
    "src/pages/Categories.tsx",
    "src/pages/Reports.tsx",
    "src/pages/Settings.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Corrigindo encoding de: $file"
        
        # Ler conteúdo
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Remover acentos problemáticos e substituir por versões sem acento
        $replacements = @{
            'é' = 'e'
            'á' = 'a'
            'à' = 'a'
            'â' = 'a'
            'ã' = 'a'
            'õ' = 'o'
            'ó' = 'o'
            'ô' = 'o'
            'í' = 'i'
            'ú' = 'u'
            'ç' = 'c'
            'É' = 'E'
            'Á' = 'A'
            'Ã' = 'A'
            'Ó' = 'O'
            'Í' = 'I'
            'Ú' = 'U'
            'Ç' = 'C'
        }
        
        foreach ($key in $replacements.Keys) {
            $content = $content.Replace($key, $replacements[$key])
        }
        
        # Salvar com UTF-8 sem BOM
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($file, $content, $utf8NoBom)
        
        Write-Host "? Arquivo corrigido: $file" -ForegroundColor Green
    } else {
        Write-Host "? Arquivo não encontrado: $file" -ForegroundColor Red
    }
}

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "Processo concluído!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "`nPróximos passos:" -ForegroundColor Yellow
Write-Host "1. Execute: npm install" -ForegroundColor White
Write-Host "2. Execute: npm run dev" -ForegroundColor White
Write-Host "3. O site agora funcionará sem problemas de encoding" -ForegroundColor White
