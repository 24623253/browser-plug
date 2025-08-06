# 🔍 调试帮助指南

## 下载问题排查

如果遇到下载卡在"准备下载"阶段，请按以下步骤排查：

### 1. 打开开发者工具
1. 右键点击插件图标 → "检查"
2. 或按 F12 打开开发者工具
3. 切换到 "Console" 标签页

### 2. 查看错误日志
点击下载按钮后，观察控制台输出：

#### 正常情况应该看到：
```
开始下载请求: YouTube 720p
开始下载视频: {video object} {quality object}
准备下载: https://video-url...
下载已开始，ID: 123
```

#### 常见错误信息：

**YouTube相关：**
```
YouTube视频需要使用外部工具下载，请点击'用 yt-dlp 下载'
```
**解决方案：** 使用 yt-dlp 工具或点击"用 yt-dlp 下载"按钮

**B站相关：**
```
B站视频解析需要登录认证，建议使用外部下载工具
```
**解决方案：** 在设置中配置B站Cookie或使用外部工具

**抖音相关：**
```
无法获取抖音视频直接下载链接，视频可能有防护措施
```
**解决方案：** 刷新页面重试，或使用外部工具

**超时错误：**
```
请求超时，请重试
解析超时
```
**解决方案：** 网络问题，请重试

### 3. 检查视频检测
在视频页面的控制台中查看：

```javascript
// 手动检测视频元素
console.log('所有video元素:', document.querySelectorAll('video'));
console.log('video源地址:', [...document.querySelectorAll('video')].map(v => v.src || v.currentSrc));
```

### 4. 验证权限
在 `chrome://extensions/` 页面：
1. 找到"视频下载助手"
2. 点击"详细信息"  
3. 确认权限包括：
   - ✅ 读取和更改您在所有网站上的数据
   - ✅ 管理您的下载内容

### 5. 测试下载功能
使用这个简单的测试视频：
```
https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4
```

在控制台运行：
```javascript
chrome.downloads.download({
  url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  filename: 'test-video.mp4'
});
```

## 平台特定问题

### YouTube
- **问题**：所有YouTube视频都无法直接下载
- **原因**：YouTube有强力的防护措施
- **解决**：必须使用 yt-dlp 等外部工具

### 哔哩哔哩
- **问题**：只能看到低画质选项
- **原因**：未登录或Cookie过期
- **解决**：
  1. 在浏览器登录B站
  2. F12 → Application → Cookies → bilibili.com
  3. 复制所有cookie到插件设置中

### 抖音
- **问题**：检测不到视频或下载失败
- **原因**：页面动态加载或防护措施
- **解决**：
  1. 等待视频完全加载
  2. 确保视频正在播放
  3. 刷新页面重试

## 常用调试命令

### 检查插件状态
```javascript
// 检查插件是否加载
chrome.runtime.sendMessage({action: 'ping'}, response => {
  console.log('插件响应:', response);
});
```

### 手动触发视频检测
```javascript
// 在content script中
detector.detectVideos().then(videos => {
  console.log('检测结果:', videos);
});
```

### 查看存储的设置
```javascript
chrome.storage.sync.get(null, result => {
  console.log('当前设置:', result);
});
```

## 重置插件

如果问题持续存在：

1. **重新加载插件**
   - chrome://extensions/ → 点击刷新按钮

2. **清除插件数据**
   ```javascript
   chrome.storage.sync.clear();
   chrome.storage.local.clear();
   ```

3. **重装插件**
   - 移除插件 → 重新加载

## 获取帮助

如果问题仍未解决：

1. **收集信息**：
   - 浏览器版本
   - 操作系统
   - 问题视频URL
   - 控制台错误信息

2. **提交反馈**：
   - GitHub Issues
   - 邮件反馈
   - 包含调试信息

## 成功案例

### 抖音视频下载成功的日志：
```
检查video元素: {src: "https://v3-web.douyinvod.com/...", duration: 15.2}
抖音视频源URL: https://v3-web.douyinvod.com/...
找到抖音直接链接: https://v3-web.douyinvod.com/...
准备下载: https://v3-web.douyinvod.com/...
下载已开始，ID: 456
```

这种情况下载应该能正常进行。