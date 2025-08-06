# 🚀 yt-dlp 简单使用指南（Windows版）

## ❓ yt-dlp 是什么？

**yt-dlp 是一个命令行视频下载工具**，不是浏览器插件！

- ✅ **功能**：从YouTube、B站、抖音等网站下载视频
- ✅ **特点**：支持多种画质、批量下载、字幕下载
- ✅ **运行方式**：在命令提示符中运行

## 📥 下载和安装

### 1. 下载 yt-dlp.exe
1. 访问：https://github.com/yt-dlp/yt-dlp/releases
2. 下载 `yt-dlp.exe`
3. 放到一个固定文件夹，比如：`C:\yt-dlp\`

### 2. 添加到系统PATH（可选但推荐）
1. 右键"此电脑" → "属性" → "高级系统设置"
2. 点击"环境变量"
3. 在"系统变量"中找到"Path"，点击"编辑"
4. 点击"新建"，添加 `C:\yt-dlp\`
5. 点击"确定"保存

## 🎯 基本使用方法

### 方法1：使用命令提示符

#### 步骤1：打开命令提示符
- 按 `Win + R`
- 输入 `cmd`
- 按回车

#### 步骤2：切换到yt-dlp文件夹
```cmd
cd C:\yt-dlp
```

#### 步骤3：下载视频
```cmd
# 下载YouTube视频
yt-dlp.exe "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

# 下载B站视频
yt-dlp.exe "https://www.bilibili.com/video/BV1xx411c7mD"

# 下载抖音视频
yt-dlp.exe "https://www.douyin.com/video/视频ID"
```

### 方法2：创建批处理文件

#### 创建 download.bat
1. 在 `C:\yt-dlp\` 文件夹中创建 `download.bat`
2. 用记事本打开，输入以下内容：

```batch
@echo off
echo ========================================
echo           视频下载工具
echo ========================================
echo.
echo 请输入视频URL：
set /p url=
echo.
echo 开始下载...
yt-dlp.exe "%url%"
echo.
echo 下载完成！
pause
```

3. 保存文件
4. 双击 `download.bat` 即可使用

### 方法3：使用我们的浏览器插件

1. **安装我们的浏览器插件**
2. **访问视频网站**（YouTube、B站、抖音等）
3. **点击插件图标**
4. **选择"用 yt-dlp 下载"**
5. **复制生成的命令**
6. **在命令提示符中运行**

## 🔧 常用命令

### 1. 查看可用格式
```cmd
yt-dlp.exe -F "视频URL"
```

### 2. 下载指定画质
```cmd
# 下载720p
yt-dlp.exe -f "best[height<=720]" "视频URL"

# 下载1080p
yt-dlp.exe -f "best[height<=1080]" "视频URL"
```

### 3. 下载音频
```cmd
# 下载音频并转换为MP3
yt-dlp.exe -f "bestaudio" --extract-audio --audio-format mp3 "视频URL"
```

### 4. 下载字幕
```cmd
# 下载字幕
yt-dlp.exe --write-subs "视频URL"
```

## 🌐 平台特定用法

### YouTube
```cmd
# 基本下载
yt-dlp.exe "https://www.youtube.com/watch?v=VIDEO_ID"

# 下载字幕
yt-dlp.exe --write-subs --write-auto-subs "视频URL"
```

### 哔哩哔哩
```cmd
# 使用浏览器cookie（需要先在浏览器登录B站）
yt-dlp.exe --cookies-from-browser chrome "https://www.bilibili.com/video/BV号"
```

### 抖音
```cmd
# 下载抖音视频
yt-dlp.exe --no-check-certificates "https://www.douyin.com/video/视频ID"
```

## 🛠️ 常见问题解决

### 问题1：双击yt-dlp.exe没反应
**解决**：这是正常的！yt-dlp需要在命令行中使用

### 问题2：提示"不是内部或外部命令"
**解决**：
1. 确保在正确的文件夹中运行
2. 或使用完整路径：`C:\yt-dlp\yt-dlp.exe "视频URL"`

### 问题3：下载失败
**解决**：
```cmd
# 更新yt-dlp
yt-dlp.exe -U

# 使用详细输出查看错误
yt-dlp.exe -v "视频URL"
```

### 问题4：B站视频下载失败
**解决**：
1. 先在浏览器中登录B站
2. 使用cookie参数：
```cmd
yt-dlp.exe --cookies-from-browser chrome "B站视频URL"
```

## 📱 与浏览器插件配合使用

### 完整工作流程

1. **安装浏览器插件**
   - 下载我们的Chrome插件
   - 在Chrome中加载插件

2. **访问视频网站**
   - 打开YouTube、B站或抖音
   - 找到想要下载的视频

3. **使用插件检测**
   - 点击插件图标
   - 插件会自动检测视频信息

4. **生成下载命令**
   - 选择"用 yt-dlp 下载"
   - 插件会生成完整的下载命令

5. **执行下载**
   - 复制生成的命令
   - 在命令提示符中运行

### 插件生成的命令示例

#### YouTube视频
```cmd
yt-dlp.exe "https://www.youtube.com/watch?v=VIDEO_ID" -f "best[height<=720]" --write-subs --write-auto-subs --embed-subs -o "%(title)s.%(ext)s"
```

#### B站视频
```cmd
yt-dlp.exe "https://www.bilibili.com/video/BV号" -f "best[height<=720]" --cookies-from-browser chrome -o "%(title)s.%(ext)s"
```

## 💡 使用技巧

### 1. 创建快捷方式
- 右键 `download.bat`
- 选择"创建快捷方式"
- 放到桌面，方便使用

### 2. 设置默认下载文件夹
```cmd
# 下载到指定文件夹
yt-dlp.exe -o "C:\Downloads\%(title)s.%(ext)s" "视频URL"
```

### 3. 批量下载
```cmd
# 下载播放列表
yt-dlp.exe "播放列表URL"
```

## 🎯 总结

- **yt-dlp** = 命令行视频下载工具
- **我们的插件** = 浏览器插件，用于检测视频信息
- **配合使用** = 插件检测 + yt-dlp下载

**最佳使用方式**：
1. 用插件检测视频信息
2. 用yt-dlp下载视频
3. 享受高质量视频内容！

---

**💡 提示**：使用前请确保遵守相关法律法规和网站服务条款。 