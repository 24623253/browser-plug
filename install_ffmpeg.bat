@echo off
chcp 65001 >nul
echo ========================================
echo         FFmpeg 自动安装工具
echo ========================================
echo.
echo 正在检查 FFmpeg 是否已安装...

REM 检查 FFmpeg 是否已在系统PATH中
ffmpeg -version >nul 2>&1
if %errorlevel%==0 (
    echo ✅ FFmpeg 已安装在系统中！
    echo.
    ffmpeg -version | findstr "version"
    echo.
    echo 你可以直接使用合并命令了！
    goto :end
)

REM 检查当前目录是否有 ffmpeg.exe
if exist "ffmpeg.exe" (
    echo ✅ 在当前目录找到 ffmpeg.exe！
    echo.
    .\ffmpeg.exe -version | findstr "version"
    echo.
    echo 你可以直接使用合并命令了！
    goto :end
)

echo ❌ 未找到 FFmpeg
echo.
echo FFmpeg 下载选项：
echo 1. 手动下载（推荐）
echo 2. 查看安装说明
echo 3. 退出
echo.
set /p choice=请选择 (1-3): 

if "%choice%"=="1" (
    echo.
    echo 📥 手动下载步骤：
    echo.
    echo 1. 访问：https://github.com/BtbN/FFmpeg-Builds/releases
    echo 2. 下载：ffmpeg-master-latest-win64-gpl.zip
    echo 3. 解压到当前目录（%cd%）
    echo 4. 将 bin 文件夹中的 ffmpeg.exe 复制到当前目录
    echo.
    echo 或者简单方式：
    echo 1. 下载 ffmpeg.exe
    echo 2. 放到 %cd%
    echo.
    echo 下载完成后，重新运行 yt-dlp 命令即可！
) else if "%choice%"=="2" (
    echo.
    echo 📚 完整安装说明：
    echo.
    echo 方法1：系统安装（推荐）
    echo 1. 下载：https://github.com/BtbN/FFmpeg-Builds/releases
    echo 2. 解压到：C:\ffmpeg\
    echo 3. 添加到PATH：C:\ffmpeg\bin
    echo 4. 重启命令提示符
    echo.
    echo 方法2：便携版
    echo 1. 下载 ffmpeg.exe
    echo 2. 放到 yt-dlp 同一文件夹
    echo 3. 直接使用
    echo.
    echo 验证安装：
    echo ffmpeg -version
) else (
    echo 退出安装程序
    goto :end
)

:end
echo.
echo 安装完成后，使用以下命令合并视频：
echo.
echo yt-dlp.exe --cookies-from-browser chrome -f "299+bestaudio" --merge-output-format mp4 "视频URL"
echo.
echo 按任意键退出...
pause >nul