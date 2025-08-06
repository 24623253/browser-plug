@echo off
chcp 65001 >nul
echo ========================================
echo           视频下载工具 (yt-dlp)
echo ========================================
echo.
echo 请输入视频URL：
set /p url=

if "%url%"=="" (
    echo 错误：请输入有效的URL
    pause
    exit /b
)

echo.
echo 选择下载方式：
echo 1. 使用Chrome浏览器Cookie（推荐）
echo 2. 使用Edge浏览器Cookie
echo 3. 使用Firefox浏览器Cookie
echo 4. 使用Cookie文件 (cookies.txt)
echo 5. 直接下载（可能失败）
echo.
set /p choice=请选择 (1-5): 

if "%choice%"=="" set choice=1

echo.
echo 选择视频质量：
echo 1. 最佳质量（自动合并）
echo 2. 1080p60
echo 3. 720p60  
echo 4. 1080p
echo 5. 720p
echo 6. 查看所有可用格式
echo.
set /p quality=请选择质量 (1-6): 

if "%quality%"=="" set quality=1

echo.

REM 设置质量参数
if "%quality%"=="1" set format_param=
if "%quality%"=="2" set format_param=-f "best[height<=1080][fps<=60]/bestvideo[height<=1080][fps<=60]+bestaudio/best"
if "%quality%"=="3" set format_param=-f "best[height<=720][fps<=60]/bestvideo[height<=720][fps<=60]+bestaudio/best"
if "%quality%"=="4" set format_param=-f "best[height<=1080]/bestvideo[height<=1080]+bestaudio/best"
if "%quality%"=="5" set format_param=-f "best[height<=720]/bestvideo[height<=720]+bestaudio/best"
if "%quality%"=="6" (
    echo 查看可用格式...
    goto LIST_FORMATS
)

echo 开始下载...
echo.

if "%choice%"=="1" (
    echo 使用Chrome浏览器Cookie...
    echo 正在检查Chrome进程...
    tasklist | findstr /i chrome >nul
    if not errorlevel 1 (
        echo.
        echo ⚠️  警告：检测到Chrome正在运行！
        echo Chrome必须完全关闭才能访问Cookie数据库。
        echo.
        echo 选择操作：
        echo A. 自动关闭Chrome并继续
        echo B. 手动关闭Chrome后按任意键继续
        echo C. 使用Edge浏览器Cookie
        echo.
        set /p action=请选择 (A/B/C): 
        
        if /i "%action%"=="A" (
            echo 正在关闭Chrome进程...
            taskkill /f /im chrome.exe >nul 2>&1
            taskkill /f /im "Google Chrome" >nul 2>&1
            timeout /t 2 >nul
            echo Chrome已关闭，继续下载...
        )
        if /i "%action%"=="B" (
            echo 请手动关闭Chrome浏览器，然后按任意键继续...
            pause >nul
        )
        if /i "%action%"=="C" (
            echo 切换到Edge浏览器Cookie...
            yt-dlp.exe --cookies-from-browser edge %format_param% "%url%"
            goto END
        )
    )
    yt-dlp.exe --cookies-from-browser chrome %format_param% "%url%"
) else if "%choice%"=="2" (
    echo 使用Edge浏览器Cookie...
    yt-dlp.exe --cookies-from-browser edge %format_param% "%url%"
) else if "%choice%"=="3" (
    echo 使用Firefox浏览器Cookie...
    yt-dlp.exe --cookies-from-browser firefox %format_param% "%url%"
) else if "%choice%"=="4" (
    echo 使用Cookie文件...
    if exist "cookies.txt" (
        yt-dlp.exe --cookies cookies.txt %format_param% "%url%"
    ) else (
        echo 错误：找不到cookies.txt文件
        echo 请先导出Cookie文件到当前目录
        echo.
        echo ⚠️  重要：YouTube Cookie导出方法（官方推荐）：
        echo 1. 打开新的无痕/隐私浏览窗口
        echo 2. 在无痕窗口中登录YouTube
        echo 3. 在同一窗口访问 https://www.youtube.com/robots.txt
        echo 4. 安装扩展 "Get cookies.txt LOCALLY" 并导出youtube.com的Cookie
        echo 5. 立即关闭无痕窗口（重要！）
        echo 6. 将cookies.txt文件放在此脚本同一目录
        echo.
        echo 💡 为什么要用无痕窗口？
        echo    YouTube会频繁轮换普通标签页的Cookie，导致很快失效
    )
) else (
    echo 直接下载...
    yt-dlp.exe %format_param% "%url%"
)

goto END

:LIST_FORMATS
echo.
echo 查看所有可用格式...
if "%choice%"=="1" (
    yt-dlp.exe --cookies-from-browser chrome -F "%url%"
) else if "%choice%"=="2" (
    yt-dlp.exe --cookies-from-browser edge -F "%url%"
) else if "%choice%"=="3" (
    yt-dlp.exe --cookies-from-browser firefox -F "%url%"
) else if "%choice%"=="4" (
    if exist "cookies.txt" (
        yt-dlp.exe --cookies cookies.txt -F "%url%"
    ) else (
        yt-dlp.exe -F "%url%"
    )
) else (
    yt-dlp.exe -F "%url%"
)
echo.
echo 查看完毕！请重新运行脚本并选择具体格式。
goto END

:END
echo.
echo ========================================
echo 操作完成！
echo ========================================
echo.
echo 如果下载失败，常见解决方案：
echo 1. 确保Chrome完全关闭（包括后台进程）
echo 2. 尝试使用其他浏览器的Cookie（Edge/Firefox）
echo 3. 使用无痕窗口导出cookies.txt文件（官方推荐方法）
echo 4. 检查FFmpeg是否正确安装（用于合并视频音频）
echo 5. 考虑使用一次性账户以避免主账户被封禁风险
echo.
echo 按任意键退出...
pause >nul