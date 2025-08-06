// 注入脚本 - 深度访问页面JavaScript环境
// 用于获取一些content script无法直接访问的页面数据

(function() {
  'use strict';
  
  console.log('视频下载助手 - 注入脚本已加载');
  
  // 深度视频检测器
  class DeepVideoDetector {
    constructor() {
      this.detectedVideos = new Map();
      this.observers = [];
      this.init();
    }
    
    init() {
      // 监听网络请求（如果可能）
      this.interceptNetworkRequests();
      
      // 监听播放器事件
      this.monitorPlayerEvents();
      
      // 定期检查视频更新
      setInterval(() => this.checkForNewVideos(), 3000);
    }
    
    // 拦截网络请求获取视频URL
    interceptNetworkRequests() {
      const originalFetch = window.fetch;
      const originalXHR = window.XMLHttpRequest.prototype.open;
      
      // 拦截fetch请求
      window.fetch = function(...args) {
        const url = args[0];
        if (typeof url === 'string' && url.includes('video')) {
          console.log('检测到视频相关请求:', url);
        }
        return originalFetch.apply(this, args);
      };
      
      // 拦截XHR请求
      window.XMLHttpRequest.prototype.open = function(method, url) {
        if (url && url.includes('video')) {
          console.log('检测到XHR视频请求:', url);
        }
        return originalXHR.apply(this, arguments);
      };
    }
    
    // 监听播放器事件
    monitorPlayerEvents() {
      // YouTube播放器监听
      if (window.location.hostname.includes('youtube.com')) {
        this.monitorYouTubePlayer();
      }
      
      // B站播放器监听
      if (window.location.hostname.includes('bilibili.com')) {
        this.monitorBilibiliPlayer();
      }
      
      // 抖音播放器监听
      if (window.location.hostname.includes('douyin.com')) {
        this.monitorDouyinPlayer();
      }
    }
    
    // YouTube播放器深度检测
    monitorYouTubePlayer() {
      // 等待播放器加载
      const checkPlayer = () => {
        if (window.ytplayer && window.ytplayer.config) {
          const config = window.ytplayer.config;
          console.log('YouTube播放器配置:', config);
          
          // 尝试提取视频流URL
          if (config.args && config.args.player_response) {
            try {
              const playerResponse = JSON.parse(config.args.player_response);
              this.extractYouTubeStreams(playerResponse);
            } catch (e) {
              console.error('解析YouTube播放器响应失败:', e);
            }
          }
        } else {
          setTimeout(checkPlayer, 1000);
        }
      };
      
      checkPlayer();
    }
    
    // 提取YouTube视频流
    extractYouTubeStreams(playerResponse) {
      if (!playerResponse.streamingData) return;
      
      const streams = [];
      
      // 提取格式化流
      if (playerResponse.streamingData.formats) {
        playerResponse.streamingData.formats.forEach(format => {
          streams.push({
            quality: format.qualityLabel || format.quality,
            url: format.url,
            mimeType: format.mimeType,
            itag: format.itag
          });
        });
      }
      
      // 提取自适应流
      if (playerResponse.streamingData.adaptiveFormats) {
        playerResponse.streamingData.adaptiveFormats.forEach(format => {
          if (format.mimeType.includes('video')) {
            streams.push({
              quality: format.qualityLabel || format.quality,
              url: format.url,
              mimeType: format.mimeType,
              itag: format.itag
            });
          }
        });
      }
      
      console.log('提取到的YouTube视频流:', streams);
      this.notifyContentScript('youtubeStreams', streams);
    }
    
    // B站播放器监听
    monitorBilibiliPlayer() {
      // 监听B站播放器API
      const checkBiliPlayer = () => {
        if (window.player && window.player.getVideoData) {
          try {
            const videoData = window.player.getVideoData();
            console.log('B站视频数据:', videoData);
            this.notifyContentScript('bilibiliData', videoData);
          } catch (e) {
            console.error('获取B站视频数据失败:', e);
          }
        }
        
        // 检查window对象中的视频信息
        if (window.__INITIAL_STATE__) {
          console.log('B站初始状态:', window.__INITIAL_STATE__);
        }
        
        setTimeout(checkBiliPlayer, 2000);
      };
      
      checkBiliPlayer();
    }
    
    // 抖音播放器监听
    monitorDouyinPlayer() {
      // 监听抖音的视频元素
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        if (video.src || video.srcObject) {
          console.log('检测到抖音视频:', {
            src: video.src,
            duration: video.duration,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight
          });
          
          this.notifyContentScript('douyinVideo', {
            src: video.src,
            duration: video.duration,
            width: video.videoWidth,
            height: video.videoHeight
          });
        }
      });
    }
    
    // 检查新视频
    checkForNewVideos() {
      const videos = document.querySelectorAll('video');
      videos.forEach((video, index) => {
        const videoId = `video_${index}_${video.src || 'no_src'}`;
        
        if (!this.detectedVideos.has(videoId)) {
          this.detectedVideos.set(videoId, {
            element: video,
            src: video.src || video.currentSrc,
            duration: video.duration,
            detected: new Date()
          });
          
          console.log('发现新视频:', videoId);
          this.analyzeVideo(video);
        }
      });
    }
    
    // 分析视频元素
    analyzeVideo(videoElement) {
      const analysis = {
        src: videoElement.src || videoElement.currentSrc,
        duration: videoElement.duration,
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
        volume: videoElement.volume,
        muted: videoElement.muted,
        poster: videoElement.poster,
        crossOrigin: videoElement.crossOrigin,
        preload: videoElement.preload,
        autoplay: videoElement.autoplay,
        loop: videoElement.loop,
        controls: videoElement.controls
      };
      
      // 检查视频源
      if (videoElement.children) {
        const sources = Array.from(videoElement.children)
          .filter(child => child.tagName === 'SOURCE')
          .map(source => ({
            src: source.src,
            type: source.type,
            media: source.media
          }));
        
        if (sources.length > 0) {
          analysis.sources = sources;
        }
      }
      
      console.log('视频分析结果:', analysis);
      this.notifyContentScript('videoAnalysis', analysis);
    }
    
    // 通知content script
    notifyContentScript(type, data) {
      document.dispatchEvent(new CustomEvent('videoDetectorMessage', {
        detail: { type, data }
      }));
    }
    
    // 获取页面中的全局变量（如果有的话）
    extractGlobalVideoData() {
      const globalData = {};
      
      // YouTube
      if (window.ytInitialData) {
        globalData.youtubeInitialData = window.ytInitialData;
      }
      
      if (window.ytInitialPlayerResponse) {
        globalData.youtubePlayerResponse = window.ytInitialPlayerResponse;
      }
      
      // B站
      if (window.__INITIAL_STATE__) {
        globalData.bilibiliInitialState = window.__INITIAL_STATE__;
      }
      
      if (window.__playinfo__) {
        globalData.bilibiliPlayinfo = window.__playinfo__;
      }
      
      // 抖音
      if (window.__INITIAL_SSR_STATE__) {
        globalData.douyinSSRState = window.__INITIAL_SSR_STATE__;
      }
      
      if (Object.keys(globalData).length > 0) {
        console.log('提取到的全局视频数据:', globalData);
        this.notifyContentScript('globalVideoData', globalData);
      }
    }
  }
  
  // 创建检测器实例
  const detector = new DeepVideoDetector();
  
  // 页面加载完成后提取全局数据
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => detector.extractGlobalVideoData(), 2000);
    });
  } else {
    setTimeout(() => detector.extractGlobalVideoData(), 2000);
  }
  
  // 监听来自content script的消息
  document.addEventListener('contentScriptMessage', (event) => {
    const { type, data } = event.detail;
    
    switch (type) {
      case 'requestVideoData':
        detector.extractGlobalVideoData();
        break;
      case 'requestVideoAnalysis':
        detector.checkForNewVideos();
        break;
    }
  });
  
  console.log('深度视频检测器初始化完成');
})();