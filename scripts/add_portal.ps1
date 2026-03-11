$modalsDir = "f:\CURSOR\fincontrol\src\components\modals"
$files = Get-ChildItem "$modalsDir\*.tsx" | Where-Object { (Get-Content $_.FullName -Raw) -notmatch "createPortal" }

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # 1. Add createPortal import after the last framer/motion import or after first import block
    if ($content -match "from 'framer-motion'") {
        $content = $content -replace "(from 'framer-motion')", "`$1`r`nimport { createPortal } from 'react-dom'"
    } elseif ($content -match 'from "framer-motion"') {
        $content = $content -replace '(from "framer-motion")', "`$1`r`nimport { createPortal } from 'react-dom'"
    } else {
        # Add after first import line
        $content = $content -replace "(^import .+`r?`n)", "`$1import { createPortal } from 'react-dom'`r`n"
    }
    
    # 2. Wrap AnimatePresence with portal
    # Pattern: return (\n    <AnimatePresence>  -->  return createPortal(\n    <AnimatePresence>,
    $content = $content -replace "return \(\s*(<AnimatePresence)", "return createPortal(`r`n    `$1"
    
    # 3. Close portal: </AnimatePresence>\n  ) --> </AnimatePresence>,\n    document.body\n  )
    # This is more complex - we need to find the last closing pattern
    $content = $content -replace "</AnimatePresence>\s*\)", "</AnimatePresence>,`r`n    document.body`r`n  )"
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
    Write-Host "Done: $($file.Name)"
}

Write-Host "All modals updated!"
