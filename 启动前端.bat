@echo off
echo ========================================
echo   校园安全管理系统 - 前端服务启动
echo ========================================
echo.

cd /d "%~dp0.."

echo [1/3] 正在安装依赖...
npm.cmd install

if %ERRORLEVEL% NEQ 0 (
    echo [错误] 依赖安装失败
    pause
    exit /b 1
)

echo.
echo [2/3] 依赖安装完成
echo.

echo [3/3] 正在启动前端服务...
echo.
echo 服务地址: http://localhost:5173
echo.
echo 按 Ctrl+C 停止服务
echo.

npm.cmd run dev
