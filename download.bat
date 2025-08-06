@echo off
chcp 65001 >nul
echo ========================================
echo           视频下载工具 (yt-dlp)
echo ========================================
echo.
echo 请输入视频URL：
set /p url=
echo.
echo 选择下载方式：
echo 1. 使用浏览器Cookie（推荐）
echo 2. 直接下载（可能失败）
echo 3. 使用Cookie文件
echo.
set /p choice=请选择 (1-3): 
echo.
echo 选择视频质量：
echo 1. 最佳质量（自动选择）
echo 2. 1080p60
echo 3. 720p60
echo 4. 1080p
echo 5. 720p
echo 6. 查看所有可用格式
echo.
set /p quality=请选择质量 (1-6): 
echo.
echo 开始下载...

if "%choice%"=="1" (
    if "%quality%"=="1" (
        echo 使用Chrome浏览器Cookie，最佳质量...
        yt-dlp.exe --cookies-from-browser chrome "%url%"
    ) else if "%quality%"=="2" (
        echo 使用Chrome浏览器Cookie，1080p60...
        yt-dlp.exe --cookies-from-browser chrome -f "best[height<=1080][fps<=60]" "%url%"
    ) else if "%quality%"=="3" (
        echo 使用Chrome浏览器Cookie，720p60...
        yt-dlp.exe --cookies-from-browser chrome -f "best[height<=720][fps<=60]" "%url%"
    ) else if "%quality%"=="4" (
        echo 使用Chrome浏览器Cookie，1080p...
        yt-dlp.exe --cookies-from-browser chrome -f "best[height<=1080]" "%url%"
    ) else if "%quality%"=="5" (
        echo 使用Chrome浏览器Cookie，720p...
        yt-dlp.exe --cookies-from-browser chrome -f "best[height<=720]" "%url%"
    ) else if "%quality%"=="6" (
        echo 查看所有可用格式...
        yt-dlp.exe --cookies-from-browser chrome -F "%url%"
        echo.
        echo 请查看上面的格式列表，然后手动输入格式ID
        set /p format_id=请输入格式ID: 
        yt-dlp.exe --cookies-from-browser chrome -f %format_id% "%url%"
    ) else (
        echo 无效选择，使用最佳质量...
        yt-dlp.exe --cookies-from-browser chrome "%url%"
    )
) else if "%choice%"=="2" (
    if "%quality%"=="1" (
        echo 直接下载，最佳质量...
        yt-dlp.exe "%url%"
    ) else if "%quality%"=="2" (
        echo 直接下载，1080p60...
        yt-dlp.exe -f "best[height<=1080][fps<=60]" "%url%"
    ) else if "%quality%"=="3" (
        echo 直接下载，720p60...
        yt-dlp.exe -f "best[height<=720][fps<=60]" "%url%"
    ) else if "%quality%"=="4" (
        echo 直接下载，1080p...
        yt-dlp.exe -f "best[height<=1080]" "%url%"
    ) else if "%quality%"=="5" (
        echo 直接下载，720p...
        yt-dlp.exe -f "best[height<=720]" "%url%"
    ) else if "%quality%"=="6" (
        echo 查看所有可用格式...
        yt-dlp.exe -F "%url%"
        echo.
        echo 请查看上面的格式列表，然后手动输入格式ID
        set /p format_id=请输入格式ID: 
        yt-dlp.exe -f %format_id% "%url%"
    ) else (
        echo 无效选择，使用最佳质量...
        yt-dlp.exe "%url%"
    )
) else if "%choice%"=="3" (
    if exist "cookies.txt" (
        if "%quality%"=="1" (
            echo 使用Cookie文件，最佳质量...
            yt-dlp.exe --cookies cookies.txt "%url%"
        ) else if "%quality%"=="2" (
            echo 使用Cookie文件，1080p60...
            yt-dlp.exe --cookies cookies.txt -f "best[height<=1080][fps<=60]" "%url%"
        ) else if "%quality%"=="3" (
            echo 使用Cookie文件，720p60...
            yt-dlp.exe --cookies cookies.txt -f "best[height<=720][fps<=60]" "%url%"
        ) else if "%quality%"=="4" (
            echo 使用Cookie文件，1080p...
            yt-dlp.exe --cookies cookies.txt -f "best[height<=1080]" "%url%"
        ) else if "%quality%"=="5" (
            echo 使用Cookie文件，720p...
            yt-dlp.exe --cookies cookies.txt -f "best[height<=720]" "%url%"
        ) else if "%quality%"=="6" (
            echo 查看所有可用格式...
            yt-dlp.exe --cookies cookies.txt -F "%url%"
            echo.
            echo 请查看上面的格式列表，然后手动输入格式ID
            set /p format_id=请输入格式ID: 
            yt-dlp.exe --cookies cookies.txt -f %format_id% "%url%"
        ) else (
            echo 无效选择，使用最佳质量...
            yt-dlp.exe --cookies cookies.txt "%url%"
        )
    ) else (
        echo 错误：找不到cookies.txt文件
        echo 请先导出Cookie文件
    )
) else (
    echo 无效选择，使用默认方式...
    yt-dlp.exe --cookies-from-browser chrome "%url%"
)

echo.
echo 下载完成！
echo 按任意键退出...
pause >nul 