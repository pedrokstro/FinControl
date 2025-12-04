@echo off
echo.
echo ==========================================
echo   INICIANDO FINCONTROL
echo ==========================================
echo.
echo Aguarde enquanto o servidor inicia...
echo.
echo O navegador abrira automaticamente em:
echo http://localhost:3000
echo.
echo Credenciais de acesso:
echo Email: demo@financeiro.com
echo Senha: demo123
echo.
echo ==========================================
echo.

start http://localhost:3000
npm run dev

pause
