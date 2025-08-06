@echo off
chcp 65001 >nul
echo ========================================
echo        YouTube 一次性账户管理器
echo ========================================
echo.

:MAIN_MENU
echo 选择操作：
echo 1. 创建新的一次性账户指导
echo 2. 管理现有账户Cookie
echo 3. 测试账户状态
echo 4. 安全下载设置
echo 5. 退出
echo.
set /p choice=请选择 (1-5): 

if "%choice%"=="1" goto CREATE_GUIDE
if "%choice%"=="2" goto MANAGE_COOKIES
if "%choice%"=="3" goto TEST_ACCOUNT
if "%choice%"=="4" goto SAFE_DOWNLOAD
if "%choice%"=="5" goto EXIT
goto MAIN_MENU

:CREATE_GUIDE
cls
echo ========================================
echo         创建一次性账户指导
echo ========================================
echo.
echo 步骤1: 获取临时邮箱
echo ┌─────────────────────────────────────┐
echo │ 推荐临时邮箱服务：                  │
echo │ • 10minutemail.com                  │
echo │ • guerrillamail.com                 │
echo │ • temp-mail.org                     │
echo └─────────────────────────────────────┘
echo.
echo 步骤2: 创建Google账户
echo ┌─────────────────────────────────────┐
echo │ 1. 访问 accounts.google.com         │
echo │ 2. 点击"创建账户" → "个人用途"      │
echo │ 3. 使用临时邮箱注册                 │
echo │ 4. 设置简单密码（记住它！）         │
echo │ 5. 跳过手机验证（如果可能）         │
echo └─────────────────────────────────────┘
echo.
echo 步骤3: 首次登录YouTube
echo ┌─────────────────────────────────────┐
echo │ 1. 打开无痕浏览窗口                 │
echo │ 2. 访问 youtube.com 并登录          │
echo │ 3. 访问 youtube.com/robots.txt      │
echo │ 4. 导出Cookie到文件                 │
echo │ 5. 关闭无痕窗口                     │
echo └─────────────────────────────────────┘
echo.
echo ⚠️  重要提醒：
echo • 不要在一次性账户中添加个人信息
echo • 不要关联其他Google服务
echo • 控制下载频率避免被封
echo.
pause
goto MAIN_MENU

:MANAGE_COOKIES
cls
echo ========================================
echo         Cookie文件管理
echo ========================================
echo.
echo 当前目录中的Cookie文件：
if exist "cookies*.txt" (
    dir /b cookies*.txt
) else (
    echo 未找到Cookie文件
)
echo.
echo 操作选项：
echo 1. 重命名Cookie文件（用于多账户管理）
echo 2. 备份当前Cookie文件
echo 3. 删除失效的Cookie文件
echo 4. 返回主菜单
echo.
set /p cookie_choice=请选择 (1-4): 

if "%cookie_choice%"=="1" goto RENAME_COOKIE
if "%cookie_choice%"=="2" goto BACKUP_COOKIE
if "%cookie_choice%"=="3" goto DELETE_COOKIE
if "%cookie_choice%"=="4" goto MAIN_MENU
goto MANAGE_COOKIES

:RENAME_COOKIE
echo.
echo 请输入新的Cookie文件名（不含.txt）：
set /p new_name=
if exist "cookies.txt" (
    ren "cookies.txt" "%new_name%.txt"
    echo Cookie文件已重命名为: %new_name%.txt
) else (
    echo 未找到cookies.txt文件
)
pause
goto MANAGE_COOKIES

:BACKUP_COOKIE
echo.
set backup_name=cookies_backup_%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%
set backup_name=%backup_name: =0%
if exist "cookies.txt" (
    copy "cookies.txt" "%backup_name%.txt"
    echo Cookie文件已备份为: %backup_name%.txt
) else (
    echo 未找到cookies.txt文件
)
pause
goto MANAGE_COOKIES

:DELETE_COOKIE
echo.
echo 确定要删除所有Cookie文件吗？(Y/N)
set /p confirm=
if /i "%confirm%"=="Y" (
    del cookies*.txt 2>nul
    echo 所有Cookie文件已删除
) else (
    echo 操作已取消
)
pause
goto MANAGE_COOKIES

:TEST_ACCOUNT
cls
echo ========================================
echo         测试账户状态
echo ========================================
echo.
if not exist "cookies.txt" (
    echo 错误：未找到cookies.txt文件
    echo 请先导出Cookie文件
    pause
    goto MAIN_MENU
)

echo 正在测试账户状态...
echo 使用测试视频: https://www.youtube.com/watch?v=jNQXAC9IVRw
echo.
yt-dlp.exe --cookies cookies.txt --simulate --quiet "https://www.youtube.com/watch?v=jNQXAC9IVRw"

if %errorlevel%==0 (
    echo ✅ 账户状态正常，Cookie有效
) else (
    echo ❌ 账户可能有问题，建议更新Cookie或更换账户
)
echo.
pause
goto MAIN_MENU

:SAFE_DOWNLOAD
cls
echo ========================================
echo         安全下载设置
echo ========================================
echo.
echo 请输入视频URL：
set /p url=
echo.
echo 选择安全下载模式：
echo 1. 保守模式（慢但安全）- 10秒间隔
echo 2. 平衡模式（推荐）- 5秒间隔  
echo 3. 快速模式（有风险）- 2秒间隔
echo.
set /p safe_choice=请选择 (1-3): 

if "%safe_choice%"=="1" set sleep_time=10
if "%safe_choice%"=="2" set sleep_time=5
if "%safe_choice%"=="3" set sleep_time=2

echo.
echo 开始安全下载...
echo 使用间隔: %sleep_time%秒
echo.

if exist "cookies.txt" (
    yt-dlp.exe --cookies cookies.txt --sleep-interval %sleep_time% --max-downloads 20 "%url%"
) else (
    echo 警告：未找到cookies.txt，使用无Cookie下载
    yt-dlp.exe --sleep-interval %sleep_time% --max-downloads 20 "%url%"
)

echo.
echo 下载完成！
pause
goto MAIN_MENU

:EXIT
echo.
echo 使用提醒：
echo • 定期更换一次性账户
echo • 控制下载频率
echo • 备份重要的Cookie文件
echo.
echo 再见！
pause
exit
