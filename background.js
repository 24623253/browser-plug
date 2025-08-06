// 后台脚本 - 处理下载逻辑和跨域请求

console.log('视频下载助手 - 后台脚本已启动');

// 下载管理器
class DownloadManager {
  constructor() {
    this.downloads = new Map();
    this.init();
  }

  init() {
    // 监听下载状态变化
    chrome.downloads.onChanged.addListener((downloadDelta) => {
      this.handleDownloadProgress(downloadDelta);
    });

    // 监听下载完成
    chrome.downloads.onDeterminingFilename.addListener(
      (downloadItem, suggest) => {
        this.handleFilenameGeneration(downloadItem, suggest);
      }
    );
  }

  // 处理视频下载
  async downloadVideo(video, quality, videoIndex) {
    try {
      console.log('开始下载视频:', video, quality);

      let downloadUrl = quality.url;
      let filename = this.generateFilename(video, quality);

      // 如果没有直接的下载链接，尝试解析
      if (!downloadUrl || !downloadUrl.startsWith('http')) {
        try {
          downloadUrl = await Promise.race([
            this.resolveVideoUrl(video, quality),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('解析超时')), 10000)
            )
          ]);
        } catch (resolveError) {
          console.error('视频链接解析失败:', resolveError);
          // 根据平台给出不同的建议
          if (video.platform === 'YouTube') {
            throw new Error('YouTube视频下载受限，请使用"yt-dlp下载"按钮');
          } else if (video.platform === '哔哩哔哩') {
            throw new Error('B站视频需要登录验证，请在设置中配置Cookie或使用外部工具');
          } else {
            throw new Error(`无法解析${video.platform}视频链接: ${resolveError.message}`);
          }
        }
      }

      if (!downloadUrl) {
        throw new Error('无法获取视频下载链接，请尝试使用外部工具');
      }

      console.log('准备下载:', downloadUrl);

      // 开始下载
      const downloadId = await chrome.downloads.download({
        url: downloadUrl,
        filename: filename,
        conflictAction: 'uniquify',
        saveAs: false,
      });

      // 记录下载信息
      this.downloads.set(downloadId, {
        video: video,
        quality: quality,
        videoIndex: videoIndex,
        startTime: Date.now(),
      });

      console.log('下载已开始，ID:', downloadId);
      return { success: true, downloadId: downloadId };
    } catch (error) {
      console.error('下载失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 解析视频真实下载地址
  async resolveVideoUrl(video, quality) {
    try {
      switch (video.platform) {
        case 'YouTube':
          return await this.resolveYouTubeUrl(video, quality);
        case '哔哩哔哩':
          return await this.resolveBilibiliUrl(video, quality);
        case '抖音':
          return await this.resolveDouyinUrl(video, quality);
        default:
          return quality.url || video.url;
      }
    } catch (error) {
      console.error(`解析${video.platform}视频地址失败:`, error);
      throw error;
    }
  }

  // 解析YouTube下载地址
  async resolveYouTubeUrl(video, quality) {
    // 注意：直接从YouTube下载视频可能违反其服务条款
    // 这里仅作为示例，实际使用请遵循相关规定

    // 尝试从当前页面获取视频流信息
    try {
      const response = await this.fetchVideoInfo(video.url);
      // 这里需要解析YouTube的复杂格式
      // 实际实现需要更复杂的逻辑
      return null; // 暂时返回null，建议使用外部工具
    } catch (error) {
      console.error('YouTube地址解析失败:', error);
      throw new Error(
        "YouTube视频需要使用外部工具下载，请点击'用 yt-dlp 下载'"
      );
    }
  }

  // 解析B站下载地址
  async resolveBilibiliUrl(video, quality) {
    try {
      // B站的视频解析逻辑
      // 注意：需要处理B站的防盗链和登录验证
      const bvid = video.videoId;

      // 尝试获取播放地址（需要处理B站API的复杂认证）
      // 这里简化处理，实际需要更复杂的逻辑
      console.log('尝试解析B站视频:', bvid);

      // 暂时返回错误，建议使用外部工具
      throw new Error('B站视频解析需要登录认证，建议使用外部下载工具');
    } catch (error) {
      console.error('B站地址解析失败:', error);
      throw error;
    }
  }

  // 解析抖音下载地址
  async resolveDouyinUrl(video, quality) {
    try {
      console.log('解析抖音视频:', video, quality);
      
      // 抖音视频通常可以直接获取到video标签的src
      if (quality.url && quality.url.startsWith('http')) {
        console.log('找到抖音直接链接:', quality.url);
        return quality.url;
      }

      // 尝试从video对象的url获取
      if (video.url && video.url.startsWith('http') && !video.url.includes('douyin.com')) {
        console.log('使用video.url作为下载链接:', video.url);
        return video.url;
      }

      // 如果都没有，尝试通过页面检测获取
      console.log('尝试其他方式获取抖音视频链接...');
      throw new Error('无法获取抖音视频直接下载链接，视频可能有防护措施');
    } catch (error) {
      console.error('抖音地址解析失败:', error);
      throw error;
    }
  }

  // 获取视频信息
  async fetchVideoInfo(url) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
      return await response.text();
    } catch (error) {
      console.error('获取视频信息失败:', error);
      throw error;
    }
  }

  // 生成下载文件名
  generateFilename(video, quality) {
    // 清理文件名中的非法字符
    const cleanTitle = video.title
      .replace(/[<>:"/\\|?*]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const platform = video.platform.replace(/[^a-zA-Z0-9]/g, '');
    const qualityLabel = quality.label.replace(/[^a-zA-Z0-9]/g, '');
    const extension = quality.format || 'mp4';

    return `[${platform}] ${cleanTitle} [${qualityLabel}].${extension}`;
  }

  // 处理下载进度
  handleDownloadProgress(downloadDelta) {
    const downloadInfo = this.downloads.get(downloadDelta.id);
    if (!downloadInfo) return;

    // 发送进度更新到popup
    if (downloadDelta.state) {
      chrome.runtime.sendMessage({
        action: 'downloadProgress',
        downloadId: downloadDelta.id,
        state: downloadDelta.state.current,
        progress: downloadDelta.bytesReceived
          ? (downloadDelta.bytesReceived.current /
              downloadDelta.totalBytes.current) *
            100
          : 0,
      });
    }

    // 如果下载完成或失败，清理记录
    if (
      downloadDelta.state &&
      (downloadDelta.state.current === 'complete' ||
        downloadDelta.state.current === 'interrupted')
    ) {
      setTimeout(() => {
        this.downloads.delete(downloadDelta.id);
      }, 5000);
    }
  }

  // 处理文件名生成
  handleFilenameGeneration(downloadItem, suggest) {
    const downloadInfo = this.downloads.get(downloadItem.id);
    if (downloadInfo) {
      const filename = this.generateFilename(
        downloadInfo.video,
        downloadInfo.quality
      );
      suggest({ filename: filename });
    } else {
      suggest();
    }
  }
}

// 创建下载管理器实例
const downloadManager = new DownloadManager();

// 视频地址验证器
class UrlValidator {
  static isValidVideoUrl(url) {
    try {
      const urlObj = new URL(url);
      const validDomains = [
        'youtube.com',
        'youtu.be',
        'bilibili.com',
        'b23.tv',
        'douyin.com',
        'tiktok.com',
      ];

      return validDomains.some((domain) => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  }

  static sanitizeFilename(filename) {
    return filename
      .replace(/[<>:"/\\|?*]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 200); // 限制文件名长度
  }
}

// 外部工具集成
class ExternalTools {
  // 生成yt-dlp命令
  static generateYtDlpCommand(video, quality) {
    const qualityFlag = this.getYtDlpQualityFlag(quality.value);
    const platformFlag = this.getPlatformSpecificFlags(video.platform);
    return `yt-dlp "${video.url}" ${qualityFlag} ${platformFlag} -o "%(title)s.%(ext)s"`;
  }

  // 获取yt-dlp画质参数
  static getYtDlpQualityFlag(quality) {
    const qualityMap = {
      '1080p': "-f 'best[height<=1080]'",
      '720p': "-f 'best[height<=720]'",
      '480p': "-f 'best[height<=480]'",
      '360p': "-f 'best[height<=360]'",
      'origin': "-f 'best'",
      'original': "-f 'best'",
    };

    return qualityMap[quality] || '-f best';
  }
  
  // 获取平台特定参数
  static getPlatformSpecificFlags(platform) {
    const platformFlags = {
      'YouTube': '--cookies-from-browser chrome --write-subs --write-auto-subs --embed-subs',
      '哔哩哔哩': '--cookies-from-browser chrome',
      '抖音': '--no-check-certificates',
      '通用': '--no-check-certificates'
    };
    
    return platformFlags[platform] || '';
  }
  
  // 生成高级yt-dlp命令
  static generateAdvancedYtDlpCommand(video, quality, options = {}) {
    let command = `yt-dlp "${video.url}"`;
    
    // 画质选择
    command += ` ${this.getYtDlpQualityFlag(quality.value)}`;
    
    // 平台特定参数
    command += ` ${this.getPlatformSpecificFlags(video.platform)}`;
    
    // 输出格式
    if (options.outputFormat) {
      command += ` -o "${options.outputFormat}"`;
    } else {
      command += ` -o "%(title)s.%(ext)s"`;
    }
    
    // 额外参数
    if (options.extraArgs) {
      command += ` ${options.extraArgs}`;
    }
    
    return command;
  }

  // 生成IDM下载链接
  static generateIdmLink(url, filename) {
    return `idm://${encodeURIComponent(url)}/${encodeURIComponent(filename)}`;
  }
}

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'downloadVideo':
      downloadManager
        .downloadVideo(message.video, message.quality, message.videoIndex)
        .then((result) => {
          sendResponse(result);
        })
        .catch((error) => {
          sendResponse({ success: false, error: error.message });
        });
      return true; // 异步响应

    case 'generateYtDlpCommand':
      const command = ExternalTools.generateYtDlpCommand(
        message.video,
        message.quality
      );
      sendResponse({ success: true, command: command });
      break;

    case 'validateUrl':
      const isValid = UrlValidator.isValidVideoUrl(message.url);
      sendResponse({ success: true, isValid: isValid });
      break;

    default:
      sendResponse({ success: false, error: '未知操作' });
  }
});

// 插件安装时的初始化
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('视频下载助手已安装');

    // 设置默认配置
    chrome.storage.sync.set({
      defaultQuality: '720p',
      autoDetect: true,
      showNotifications: true,
      preferredTool: 'browser',
    });
  }
});

// 标签页更新时检查是否为支持的视频网站
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    if (UrlValidator.isValidVideoUrl(tab.url)) {
      // 在支持的视频网站上显示页面图标
      chrome.action.setBadgeText({
        tabId: tabId,
        text: '✓',
      });
      chrome.action.setBadgeBackgroundColor({
        tabId: tabId,
        color: '#4CAF50',
      });
    } else {
      chrome.action.setBadgeText({
        tabId: tabId,
        text: '',
      });
    }
  }
});

// 错误处理和日志记录
window.addEventListener('error', (event) => {
  console.error('后台脚本错误:', event.error);
});

console.log('视频下载助手后台脚本初始化完成');
