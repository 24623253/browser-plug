// 内容脚本 - 检测和解析网页中的视频
console.log('视频下载助手 - 内容脚本已加载');

// 视频检测器类
class VideoDetector {
  constructor() {
    this.platform = this.detectPlatform();
    this.videos = [];
    this.observers = [];
  }

  // 检测当前平台
  detectPlatform() {
    const hostname = window.location.hostname.toLowerCase();

    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return 'YouTube';
    } else if (
      hostname.includes('bilibili.com') ||
      hostname.includes('b23.tv')
    ) {
      return '哔哩哔哩';
    } else if (
      hostname.includes('douyin.com') ||
      hostname.includes('tiktok.com')
    ) {
      return '抖音';
    }

    return '未知平台';
  }

  // 主要的视频检测方法
  async detectVideos() {
    console.log(`在 ${this.platform} 上检测视频...`);

    try {
      switch (this.platform) {
        case 'YouTube':
          return await this.detectYouTubeVideos();
        case '哔哩哔哩':
          return await this.detectBilibiliVideos();
        case '抖音':
          return await this.detectDouyinVideos();
        default:
          return await this.detectGenericVideos();
      }
    } catch (error) {
      console.error('视频检测失败:', error);
      return [];
    }
  }

  // YouTube 视频检测
  async detectYouTubeVideos() {
    const videos = [];

    // 检测页面上的视频元素
    const videoElements = document.querySelectorAll('video');
    const videoId = this.extractYouTubeVideoId();

    if (videoId) {
      try {
        // 获取视频标题
        const titleElement =
          document.querySelector(
            'h1.title yt-formatted-string, h1 > yt-formatted-string'
          ) ||
          document.querySelector('[data-title]') ||
          document.querySelector('title');

        const title = titleElement
          ? titleElement.textContent.trim()
          : 'YouTube视频';

        // 获取视频时长
        const durationElement = document.querySelector('.ytp-time-duration');
        const duration = durationElement
          ? durationElement.textContent.trim()
          : '未知';

        // 构建视频信息
        const video = {
          url: window.location.href,
          title: title,
          platform: 'YouTube',
          duration: duration,
          videoId: videoId,
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          qualities: await this.getYouTubeQualities(videoId),
        };

        videos.push(video);
      } catch (error) {
        console.error('解析YouTube视频失败:', error);
      }
    }

    return videos;
  }

  // 获取YouTube视频的不同画质选项
  async getYouTubeQualities(videoId) {
    // 这里可以尝试解析YouTube的播放器API或者返回常见的画质选项
    return [
      { label: '1080p', value: '1080p', size: '约 100MB', format: 'mp4' },
      { label: '720p', value: '720p', size: '约 60MB', format: 'mp4' },
      { label: '480p', value: '480p', size: '约 30MB', format: 'mp4' },
      { label: '360p', value: '360p', size: '约 20MB', format: 'mp4' },
    ];
  }

  // 哔哩哔哩视频检测
  async detectBilibiliVideos() {
    const videos = [];

    try {
      // 获取B站视频信息
      const bvid = this.extractBilibiliVideoId();
      if (bvid) {
        const titleElement =
          document.querySelector('h1[data-title]') ||
          document.querySelector('.video-title, .video-name') ||
          document.querySelector('title');

        const title = titleElement
          ? titleElement.textContent.trim().replace(' - 哔哩哔哩', '')
          : '哔哩哔哩视频';

        // 获取视频时长
        const durationElement = document.querySelector('.bpx-player-ctrl-time');
        const duration = durationElement
          ? durationElement.textContent.trim()
          : '未知';

        const video = {
          url: window.location.href,
          title: title,
          platform: '哔哩哔哩',
          duration: duration,
          videoId: bvid,
          thumbnail: this.getBilibiliThumbnail(),
          qualities: await this.getBilibiliQualities(bvid),
        };

        videos.push(video);
      }
    } catch (error) {
      console.error('解析B站视频失败:', error);
    }

    return videos;
  }

  // 获取B站视频画质选项
  async getBilibiliQualities(bvid) {
    return [
      { label: '1080P', value: '1080p', size: '约 120MB', format: 'flv' },
      { label: '720P', value: '720p', size: '约 80MB', format: 'flv' },
      { label: '480P', value: '480p', size: '约 40MB', format: 'flv' },
      { label: '360P', value: '360p', size: '约 25MB', format: 'flv' },
    ];
  }

  // 抖音视频检测
  async detectDouyinVideos() {
    const videos = [];

    try {
      // 抖音的视频检测逻辑
      const videoElements = document.querySelectorAll('video');

      for (const videoEl of videoElements) {
        if (videoEl.src || videoEl.currentSrc) {
          const titleElement =
            document.querySelector('[data-e2e="video-desc"]') ||
            document.querySelector('.video-info-detail') ||
            document.querySelector('title');

          const title = titleElement
            ? titleElement.textContent.trim()
            : '抖音视频';

          const video = {
            url: window.location.href,
            title: title,
            platform: '抖音',
            duration: this.formatDuration(videoEl.duration),
            videoId: this.extractDouyinVideoId(),
            thumbnail: this.getDouyinThumbnail(videoEl),
            qualities: this.getDouyinQualities(videoEl),
          };

          videos.push(video);
        }
      }
    } catch (error) {
      console.error('解析抖音视频失败:', error);
    }

    return videos;
  }

  // 获取抖音视频画质选项
  getDouyinQualities(videoEl) {
    const src = videoEl.src || videoEl.currentSrc;
    console.log('抖音视频源URL:', src);
    
    // 检查URL是否有效
    if (!src || !src.startsWith('http')) {
      console.warn('抖音视频URL无效:', src);
      return [
        {
          label: '检测失败',
          value: 'error',
          size: '无法获取',
          format: 'mp4',
          url: null,
        },
      ];
    }
    
    return [
      {
        label: '原画',
        value: 'origin',
        size: `约 ${Math.round(videoEl.duration * 2)}MB`,
        format: 'mp4',
        url: src,
      },
      {
        label: '高清',
        value: '720p',
        size: `约 ${Math.round(videoEl.duration * 1.5)}MB`,
        format: 'mp4',
        url: src,
      },
      {
        label: '标清',
        value: '480p',
        size: `约 ${Math.round(videoEl.duration * 1)}MB`,
        format: 'mp4',
        url: src,
      },
    ];
  }

  // 通用视频检测（用于其他网站）
  async detectGenericVideos() {
    const videos = [];
    const videoElements = document.querySelectorAll('video');

    console.log(`发现 ${videoElements.length} 个video元素`);

    for (const videoEl of videoElements) {
      const src = videoEl.src || videoEl.currentSrc;
      console.log('检查video元素:', {
        src: src,
        duration: videoEl.duration,
        readyState: videoEl.readyState,
        width: videoEl.videoWidth,
        height: videoEl.videoHeight
      });

      if (src && src.startsWith('http')) {
        const video = {
          url: src,
          title: document.title || '网页视频',
          platform: '通用',
          duration: this.formatDuration(videoEl.duration),
          videoId: this.generateRandomId(),
          thumbnail: videoEl.poster || '',
          qualities: [
            {
              label: '原画质',
              value: 'original',
              size: videoEl.duration ? `约 ${Math.round(videoEl.duration * 2)}MB` : '未知',
              format: this.getVideoFormat(src),
              url: src,
            },
          ],
        };

        videos.push(video);
      }
    }

    console.log(`通用检测找到 ${videos.length} 个可下载视频`);
    return videos;
  }

  // 获取视频格式
  getVideoFormat(url) {
    const ext = url.split('.').pop().split('?')[0].toLowerCase();
    return ['mp4', 'webm', 'mov', 'avi', 'flv'].includes(ext) ? ext : 'mp4';
  }

  // 提取YouTube视频ID
  extractYouTubeVideoId() {
    const url = window.location.href;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  }

  // 提取B站视频ID
  extractBilibiliVideoId() {
    const url = window.location.href;
    const bvMatch = url.match(/bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/);
    const avMatch = url.match(/bilibili\.com\/video\/av(\d+)/);

    if (bvMatch) return bvMatch[1];
    if (avMatch) return `av${avMatch[1]}`;

    return null;
  }

  // 提取抖音视频ID
  extractDouyinVideoId() {
    const url = window.location.href;
    const match = url.match(/douyin\.com\/video\/(\d+)/);
    return match ? match[1] : this.generateRandomId();
  }

  // 获取B站缩略图
  getBilibiliThumbnail() {
    const thumbEl = document.querySelector('meta[property="og:image"]');
    return thumbEl ? thumbEl.content : '';
  }

  // 获取抖音缩略图
  getDouyinThumbnail(videoEl) {
    return videoEl.poster || '';
  }

  // 格式化时长
  formatDuration(seconds) {
    if (!seconds || isNaN(seconds)) return '未知';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  }

  // 生成随机ID
  generateRandomId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

// 创建检测器实例
const detector = new VideoDetector();

// 注入深度检测脚本
function injectDeepDetector() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('injected.js');
  script.onload = function() {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}

// 监听来自注入脚本的消息
document.addEventListener('videoDetectorMessage', (event) => {
  const { type, data } = event.detail;
  console.log('收到注入脚本消息:', type, data);
  
  // 可以根据消息类型处理不同的数据
  switch (type) {
    case 'youtubeStreams':
      detector.handleYouTubeStreams(data);
      break;
    case 'bilibiliData':
      detector.handleBilibiliData(data);
      break;
    case 'douyinVideo':
      detector.handleDouyinVideo(data);
      break;
    case 'globalVideoData':
      detector.handleGlobalData(data);
      break;
  }
});

// 向注入脚本发送消息
function sendToInjectedScript(type, data) {
  document.dispatchEvent(new CustomEvent('contentScriptMessage', {
    detail: { type, data }
  }));
}

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'detectVideos') {
    detector
      .detectVideos()
      .then((videos) => {
        console.log('检测到的视频:', videos);
        sendResponse({ videos: videos });
      })
      .catch((error) => {
        console.error('视频检测失败:', error);
        sendResponse({ videos: [] });
      });

    // 返回true表示异步响应
    return true;
  }
});

// 扩展VideoDetector类的功能
detector.handleYouTubeStreams = function(streams) {
  console.log('处理YouTube视频流:', streams);
  // 更新当前检测到的视频质量信息
};

detector.handleBilibiliData = function(data) {
  console.log('处理B站视频数据:', data);
  // 更新B站视频信息
};

detector.handleDouyinVideo = function(data) {
  console.log('处理抖音视频:', data);
  // 更新抖音视频信息
};

detector.handleGlobalData = function(data) {
  console.log('处理全局视频数据:', data);
  // 处理页面全局变量中的视频数据
};

// 页面加载完成后的初始化
function initialize() {
  // 注入深度检测脚本
  injectDeepDetector();
  
  // 延迟执行初始检测
  setTimeout(() => {
    detector.detectVideos();
    sendToInjectedScript('requestVideoData');
  }, 1000);
  
  // 定期重新检测
  setInterval(() => {
    if (document.visibilityState === 'visible') {
      detector.detectVideos();
    }
  }, 5000);
}

// 根据页面加载状态初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
