# 🎬 视频下载助手

一个功能强大的浏览器扩展，支持从 YouTube、哔哩哔哩、抖音等平台智能下载视频，并提供多种分辨率选择。

## ✨ 主要功能

- 🎯 **智能检测**: 自动识别网页中的视频内容
- 🎨 **多平台支持**: YouTube、哔哩哔哩、抖音等主流视频平台
- 📱 **多分辨率**: 支持从360p到4K的多种画质选择
- ⚡ **快速下载**: 浏览器内置下载，支持进度显示
- 🔧 **外部工具**: 集成 yt-dlp、IDM 等专业下载工具
- ⚙️ **丰富配置**: 可自定义文件名、下载路径等设置
- 🌍 **中文界面**: 完全中文化的用户界面

## 🚀 安装方法

### 开发者模式安装

1. 下载或克隆本项目到本地
2. 打开 Chrome 浏览器，进入 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目文件夹
6. 安装完成！

### 准备图标文件

由于版权原因，需要您自行准备插件图标：

1. 在 `icons/` 文件夹中放入以下规格的PNG图标：
   - `icon16.png` (16x16)
   - `icon32.png` (32x32)
   - `icon48.png` (48x48)
   - `icon128.png` (128x128)

2. 或者使用在线工具生成：[favicon.io](https://favicon.io/)

## 📖 使用指南

### 基本使用

1. 访问支持的视频网站（YouTube、B站、抖音）
2. 点击地址栏右侧的插件图标
3. 选择想要的视频画质
4. 点击"下载视频"开始下载

### 外部工具使用

#### yt-dlp (推荐)

1. 安装 [yt-dlp](https://github.com/yt-dlp/yt-dlp)
2. 在设置中配置 yt-dlp 路径
3. 点击"用 yt-dlp 下载"复制命令
4. 在命令行中执行

#### IDM 集成

1. 安装 Internet Download Manager
2. 插件会尝试调用 IDM 进行下载
3. 可在设置中配置 IDM 相关选项

## ⚙️ 配置选项

### 基本设置

- **默认画质**: 设置首选的视频画质
- **自动检测**: 页面加载时自动检测视频
- **下载通知**: 显示下载状态通知

### 下载设置  

- **文件名模板**: 自定义下载文件的命名规则
- **防重复下载**: 避免下载重复的视频文件
- **最大并发数**: 控制同时下载的视频数量

### 平台设置

- **YouTube**: 支持字幕下载等高级选项
- **哔哩哔哩**: 可配置 Cookie 以访问高画质
- **抖音**: 支持无水印下载选项

## 🔧 技术实现

### 核心架构

```
├── manifest.json       # 扩展配置文件
├── popup.html/js/css   # 弹窗界面
├── content.js          # 内容脚本（页面注入）
├── background.js       # 后台服务工作者
├── options.html/js/css # 设置页面
└── icons/              # 插件图标
```

### 视频检测原理

1. **DOM 解析**: 扫描页面中的 `<video>` 标签
2. **URL 分析**: 解析地址栏获取视频ID
3. **API 调用**: 调用平台API获取视频信息
4. **链接提取**: 解析获得真实下载地址

### 支持的视频格式

- **YouTube**: MP4, WebM (需外部工具)
- **哔哩哔哩**: FLV, MP4 (需登录)
- **抖音**: MP4 (直接支持)
- **通用**: 支持标准 HTML5 视频

## 🛠️ 开发说明

### 项目结构

```javascript
// 消息传递架构
Popup ↔ Background ↔ Content Script
  ↓         ↓           ↓
界面交互   下载管理    视频检测
```

### 核心类

- `VideoDetector`: 视频检测和解析
- `DownloadManager`: 下载任务管理
- `ExternalTools`: 外部工具集成
- `UrlValidator`: 地址验证工具

### 扩展权限

```json
{
  "permissions": [
    "activeTab",      // 访问当前标签页
    "downloads",      // 下载文件
    "storage",        // 存储设置
    "webRequest"      // 网络请求拦截
  ]
}
```

## 🔍 故障排除

### 常见问题

**Q: 检测不到视频？**
A: 确保已开启"自动检测"，并刷新页面重试

**Q: YouTube 下载失败？**  
A: YouTube 有防护机制，建议使用 yt-dlp 等外部工具

**Q: B站高画质无法下载？**
A: 需要在设置中配置有效的登录 Cookie

**Q: 插件图标不显示？**
A: 请确保 icons 文件夹中有对应规格的图标文件

### 调试模式

1. 在设置中开启"调试模式"
2. 打开浏览器开发者工具 (F12)
3. 查看 Console 中的详细日志信息

## 📄 许可证

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建功能分支: `git checkout -b feature/AmazingFeature`
3. 提交更改: `git commit -m 'Add some AmazingFeature'`
4. 推送分支: `git push origin feature/AmazingFeature`
5. 开启 Pull Request

## 📞 联系方式

- 提交 [Issues](https://github.com/your-repo/issues)
- 发送邮件至：<your-email@example.com>

## 🙏 致谢

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - 强大的视频下载工具
- [Chrome Extensions API](https://developer.chrome.com/docs/extensions/) - 官方扩展开发文档
- 所有为此项目贡献的开发者

---

**⚠️ 免责声明**: 本工具仅供学习和个人使用，请遵守各平台的服务条款和版权规定。下载的内容请勿用于商业用途，使用者需自行承担相关法律责任。
