@echo off
chcp 65001 >nul
echo ========================================
echo   CORRECAO DE ENCODING - UTF-8
echo ========================================
echo.
echo Executando correcao automatica...
echo.

powershell -ExecutionPolicy Bypass -File "fix-all-files-utf8.ps1"

echo.
echo ========================================
echo Pressione qualquer tecla para sair...
pause >nul
