# 🚀 快速开始

## ⚡ 5分钟上手指南

### 第1步：准备图标 (1分钟)
1. 访问 [Favicon Generator](https://favicon.io/favicon-generator/)
2. 输入文字 "VD" (Video Download) 或上传任意图片
3. 下载生成的图标包
4. 将 `favicon-16x16.png` 重命名为 `icon16.png`
5. 将 `favicon-32x32.png` 重命名为 `icon32.png`
6. 将 `android-chrome-192x192.png` 重命名为 `icon48.png` (可裁剪)
7. 将 `android-chrome-512x512.png` 重命名为 `icon128.png` (可裁剪)
8. 将这些文件放入 `icons/` 文件夹

### 第2步：安装插件 (2分钟)
1. 打开 Chrome，访问 `chrome://extensions/`
2. 开启右上角"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择项目文件夹
5. 看到插件出现在列表中即可

### 第3步：测试功能 (2分钟)
1. 访问 [这个YouTube视频](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
2. 点击地址栏右侧的插件图标
3. 应该看到视频信息和下载选项
4. 选择画质，点击下载测试

## 🎯 核心功能一览

### 支持的网站
- **YouTube** → 推荐用 yt-dlp 下载
- **哔哩哔哩** → 支持多画质
- **抖音** → 直接下载

### 主要按钮
- **📥 下载视频** → 浏览器直接下载
- **用 yt-dlp 下载** → 复制命令到剪贴板
- **复制链接** → 复制视频URL
- **🔄 重新检测** → 刷新视频列表
- **⚙️ 设置** → 打开配置页面

## 🔧 推荐配置

### 基础用户
- 默认画质：720p
- 自动检测：开启
- 首选工具：浏览器

### 高级用户
1. 安装 yt-dlp：`pip install yt-dlp`
2. 设置路径：`C:\Python\Scripts\yt-dlp.exe`
3. 首选工具：yt-dlp
4. 额外参数：`--embed-subs --write-thumbnail`

## ❓ 常见问题

**Q: 看不到插件图标？**
A: 检查图标文件是否放在 icons 文件夹中

**Q: 显示"未检测到视频"？**
A: 确保视频开始播放，刷新页面重试

**Q: YouTube 下载失败？**
A: YouTube 有保护，建议使用 yt-dlp

**Q: B站高画质看不到？**
A: 需要在设置中配置登录 Cookie

## 🎉 开始使用

配置完成后，就可以愉快地下载视频了！

记住：
- 遵守版权法律 ⚖️
- 仅供个人使用 👤  
- 尊重创作者权益 🎨

有问题？查看 [完整文档](README.md) 或提交 [Issue](https://github.com/your-repo/issues)！