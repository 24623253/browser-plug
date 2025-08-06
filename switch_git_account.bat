@echo off
chcp 65001 >nul
echo ================================
echo        Git账号切换工具
echo ================================
echo.
echo 请选择要切换的账号：
echo [1] GitLab账号
echo [2] GitHub账号  
echo [3] 查看当前配置
echo [4] 自定义配置
echo [5] 项目级配置（仅当前Git仓库）
echo [0] 退出
echo.
set /p choice=请输入选项 (0-5): 

if "%choice%"=="1" goto gitlab
if "%choice%"=="2" goto github
if "%choice%"=="3" goto show_config
if "%choice%"=="4" goto custom
if "%choice%"=="5" goto local_config
if "%choice%"=="0" goto exit
goto invalid

:gitlab
echo.
echo 切换到GitLab账号...
git config --global user.name "liuhongwei"
git config --global user.email "liuhongwei@starmerx.com"
echo ✓ 已切换到GitLab账号
goto show_current

:github
echo.
set /p github_name=请输入GitHub用户名: 
set /p github_email=请输入GitHub邮箱: 
echo 切换到GitHub账号...
git config --global user.name "%github_name%"
git config --global user.email "%github_email%"
echo ✓ 已切换到GitHub账号
goto show_current

:custom
echo.
set /p custom_name=请输入用户名: 
set /p custom_email=请输入邮箱: 
echo 设置自定义配置...
git config --global user.name "%custom_name%"
git config --global user.email "%custom_email%"
echo ✓ 已设置自定义配置
goto show_current

:local_config
echo.
echo 检查当前目录是否为Git仓库...
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：当前目录不是Git仓库
    echo.
    echo 解决方案：
    echo 1. 进入一个已存在的Git仓库目录
    echo 2. 或者先运行 'git init' 初始化当前目录为Git仓库
    echo 3. 或者使用全局配置（选项1-4）
    echo.
    pause
    goto menu
)
echo ✓ 当前目录是Git仓库
echo.
echo 请选择项目级配置：
echo [1] GitLab账号（项目级）
echo [2] GitHub账号（项目级）
echo [3] 自定义（项目级）
echo.
set /p local_choice=请输入选项 (1-3): 

if "%local_choice%"=="1" goto local_gitlab
if "%local_choice%"=="2" goto local_github
if "%local_choice%"=="3" goto local_custom
goto invalid_local

:local_gitlab
echo 设置项目级GitLab配置...
git config user.name "liuhongwei"
git config user.email "liuhongwei@starmerx.com"
echo ✓ 已为当前项目设置GitLab账号
goto show_current

:local_github
set /p github_name_local=请输入GitHub用户名: 
set /p github_email_local=请输入GitHub邮箱: 
echo 设置项目级GitHub配置...
git config user.name "%github_name_local%"
git config user.email "%github_email_local%"
echo ✓ 已为当前项目设置GitHub账号
goto show_current

:local_custom
set /p custom_name_local=请输入用户名: 
set /p custom_email_local=请输入邮箱: 
echo 设置项目级自定义配置...
git config user.name "%custom_name_local%"
git config user.email "%custom_email_local%"
echo ✓ 已为当前项目设置自定义配置
goto show_current

:invalid_local
echo 无效选项，请重新选择
pause
goto local_config

:show_config
:show_current
echo.
echo 当前Git配置：
echo 用户名: 
git config user.name
echo 邮箱: 
git config user.email
echo.
pause
goto menu

:invalid
echo 无效选项，请重新选择
pause
goto menu

:menu
cls
goto start

:exit
echo 再见！
exit

:start
goto menu