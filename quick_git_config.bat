@echo off
chcp 65001 >nul
echo 快速Git配置工具
echo.

REM 检查是否在Git仓库中
git status >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ 检测到Git仓库，使用项目级配置
    echo.
    set /p name=请输入用户名: 
    set /p email=请输入邮箱: 
    git config user.name "%name%"
    git config user.email "%email%"
    echo ✓ 项目级配置已设置
) else (
    echo ⚠ 当前不在Git仓库中，使用全局配置
    echo.
    set /p name=请输入用户名: 
    set /p email=请输入邮箱: 
    git config --global user.name "%name%"
    git config --global user.email "%email%"
    echo ✓ 全局配置已设置
)

echo.
echo 当前配置：
git config user.name
git config user.email
echo.
pause