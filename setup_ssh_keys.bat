@echo off
chcp 65001 >nul
echo ================================
echo      SSH密钥配置助手
echo ================================
echo.
echo 此脚本将帮助您为不同的Git服务配置SSH密钥
echo.
echo 步骤1: 生成SSH密钥
echo.
set /p service=请输入服务名称 (如: gitlab, github): 
set /p email=请输入对应的邮箱地址: 

echo.
echo 正在生成SSH密钥...
ssh-keygen -t rsa -b 4096 -C "%email%" -f "%USERPROFILE%\.ssh\id_rsa_%service%"

echo.
echo ✓ SSH密钥已生成在: %USERPROFILE%\.ssh\id_rsa_%service%
echo.
echo 步骤2: 配置SSH config文件
echo.

if not exist "%USERPROFILE%\.ssh\config" (
    echo # SSH配置文件 > "%USERPROFILE%\.ssh\config"
)

echo.
echo # %service% 配置 >> "%USERPROFILE%\.ssh\config"
echo Host %service%.com >> "%USERPROFILE%\.ssh\config"
echo   HostName %service%.com >> "%USERPROFILE%\.ssh\config"
echo   User git >> "%USERPROFILE%\.ssh\config"
echo   IdentityFile ~/.ssh/id_rsa_%service% >> "%USERPROFILE%\.ssh\config"
echo. >> "%USERPROFILE%\.ssh\config"

echo ✓ SSH配置已更新
echo.
echo 步骤3: 复制公钥到剪贴板
type "%USERPROFILE%\.ssh\id_rsa_%service%.pub" | clip
echo ✓ 公钥已复制到剪贴板
echo.
echo 请将公钥添加到您的%service%账号设置中的SSH密钥部分
echo.
pause