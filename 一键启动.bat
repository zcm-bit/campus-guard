@echo off
echo ========================================
echo   校园安全管理系统 - 一键启动
echo ========================================
echo.

cd /d "%~dp0"

echo [步骤1] 正在启动后端服务...
echo.
start "后端服务" cmd /k "cd /d %~dp0server && npm.cmd start"

timeout /t 3 /nobreak >nul

echo [步骤2] 正在启动前端服务...
echo.
start "前端服务" cmd /k "npm.cmd run dev"

echo.
echo ========================================
echo   服务启动中，请稍候...
echo ========================================
echo.
echo 后端服务: http://localhost:3000
echo 前端服务: http://localhost:5173
echo.
echo 浏览器访问: http://localhost:5173
echo.
echo 按任意键打开浏览器...
pause >nul

start http://localhost:5173
