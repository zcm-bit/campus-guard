@echo off
chcp 65001 > nul
echo ========================================
echo  校园安全管理系统 - 数据库初始化
echo ========================================
echo.

echo 正在检查MySQL服务状态...
sc query MySQL80 | findstr STATE | findstr RUNNING > nul
if %errorlevel% neq 0 (
    echo [警告] MySQL80服务未运行，正在尝试启动...
    net start MySQL80
    if %errorlevel% neq 0 (
        echo [错误] 无法启动MySQL服务，请手动启动后再试
        pause
        exit /b 1
    )
)

echo [OK] MySQL服务正在运行
echo.

echo 正在初始化数据库...
mysql -u root -p1314520xh < "%~dp0database-init.sql"

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo  数据库初始化成功！
    echo ========================================
    echo.
    echo 现在可以启动后端服务了：
    echo   node index.js
    echo.
    echo 或使用一键启动脚本：
    echo   ..\一键启动.bat
    echo.
) else (
    echo.
    echo [错误] 数据库初始化失败，请检查错误信息
)

pause
