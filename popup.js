// 全局状态管理
let currentVideos = [];
let currentTab = null;

// DOM 元素
const elements = {
  loading: null,
  noVideo: null,
  videoList: null,
  refreshBtn: null,
  settingsBtn: null,
};

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
  initializeElements();
  bindEvents();
  await loadCurrentTab();
  await detectVideos();
});

function initializeElements() {
  elements.loading = document.getElementById('loading');
  elements.noVideo = document.getElementById('no-video');
  elements.videoList = document.getElementById('video-list');
  elements.refreshBtn = document.getElementById('refresh-btn');
  elements.settingsBtn = document.getElementById('settings-btn');
}

function bindEvents() {
  elements.refreshBtn.addEventListener('click', detectVideos);
  elements.settingsBtn.addEventListener('click', openSettings);
}

async function loadCurrentTab() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    currentTab = tab;
  } catch (error) {
    console.error('获取当前标签页失败:', error);
  }
}

async function detectVideos() {
  showLoading();

  try {
    if (!currentTab) {
      await loadCurrentTab();
    }

    // 向内容脚本发送检测请求
    const response = await chrome.tabs.sendMessage(currentTab.id, {
      action: 'detectVideos',
    });

    if (response && response.videos && response.videos.length > 0) {
      currentVideos = response.videos;
      displayVideos(currentVideos);
    } else {
      showNoVideo();
    }
  } catch (error) {
    console.error('视频检测失败:', error);
    showNoVideo();
  }
}

function showLoading() {
  elements.loading.style.display = 'block';
  elements.noVideo.style.display = 'none';
  elements.videoList.style.display = 'none';
}

function showNoVideo() {
  elements.loading.style.display = 'none';
  elements.noVideo.style.display = 'block';
  elements.videoList.style.display = 'none';
}

function displayVideos(videos) {
  elements.loading.style.display = 'none';
  elements.noVideo.style.display = 'none';
  elements.videoList.style.display = 'block';

  elements.videoList.innerHTML = videos
    .map((video, index) => createVideoItemHTML(video, index))
    .join('');

  // 绑定视频项的事件
  bindVideoEvents();
}

function createVideoItemHTML(video, index) {
  const platformClass = getPlatformClass(video.platform);
  const qualityOptions = video.qualities
    .map(
      (quality, qIndex) => `
    <button class="quality-btn ${qIndex === 0 ? 'selected' : ''}" 
            data-video="${index}" 
            data-quality="${qIndex}">
      ${quality.label}
    </button>
  `
    )
    .join('');

  return `
    <div class="video-item" data-index="${index}">
      <div class="video-info">
        <div class="video-title">${video.title}</div>
        <div class="video-meta">
          <span class="platform-tag ${platformClass}">${video.platform}</span>
          <span>时长: ${video.duration || '未知'}</span>
          <span>大小: ${video.qualities[0]?.size || '未知'}</span>
        </div>
      </div>
      
      <div class="quality-options">
        ${qualityOptions}
      </div>
      
      <div class="download-section">
        <button class="btn-primary download-btn" data-video="${index}">
          📥 下载视频
        </button>
      </div>
      
      <div class="external-download">
        <a href="#" class="external-btn yt-dlp" data-video="${index}">
          用 yt-dlp 下载
        </a>
        <a href="#" class="external-btn" data-video="${index}">
          复制链接
        </a>
      </div>
      
      <div class="progress-bar" style="display: none;">
        <div class="progress-fill"></div>
      </div>
      <div class="status-text" style="display: none;"></div>
    </div>
  `;
}

function getPlatformClass(platform) {
  const platformMap = {
    YouTube: 'youtube',
    哔哩哔哩: 'bilibili',
    抖音: 'douyin',
  };
  return platformMap[platform] || '';
}

function bindVideoEvents() {
  // 画质选择按钮事件
  document.querySelectorAll('.quality-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const videoIndex = e.target.dataset.video;
      const qualityIndex = e.target.dataset.quality;

      // 更新选中状态
      const videoItem = document.querySelector(`[data-index="${videoIndex}"]`);
      videoItem.querySelectorAll('.quality-btn').forEach((b) => {
        b.classList.remove('selected');
      });
      e.target.classList.add('selected');

      // 更新显示信息
      updateVideoInfo(videoIndex, qualityIndex);
    });
  });

  // 下载按钮事件
  document.querySelectorAll('.download-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const videoIndex = e.target.dataset.video;
      downloadVideo(videoIndex);
    });
  });

  // 外部下载事件
  document.querySelectorAll('.external-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const videoIndex = e.target.dataset.video;
      const isYtDlp = e.target.classList.contains('yt-dlp');

      if (isYtDlp) {
        openWithYtDlp(videoIndex);
      } else {
        copyVideoLink(videoIndex);
      }
    });
  });
}

function updateVideoInfo(videoIndex, qualityIndex) {
  const video = currentVideos[videoIndex];
  const quality = video.qualities[qualityIndex];

  // 更新大小显示
  const videoItem = document.querySelector(`[data-index="${videoIndex}"]`);
  const sizeSpan = videoItem.querySelector('.video-meta span:last-child');
  sizeSpan.textContent = `大小: ${quality.size || '未知'}`;
}

async function downloadVideo(videoIndex) {
  const video = currentVideos[videoIndex];
  const videoItem = document.querySelector(`[data-index="${videoIndex}"]`);
  const selectedQualityBtn = videoItem.querySelector('.quality-btn.selected');
  const qualityIndex = selectedQualityBtn.dataset.quality;
  const quality = video.qualities[qualityIndex];

  const downloadBtn = videoItem.querySelector('.download-btn');
  const progressBar = videoItem.querySelector('.progress-bar');
  const statusText = videoItem.querySelector('.status-text');

  // 重置状态
  progressBar.style.display = 'block';
  statusText.style.display = 'block';
  const progressFill = progressBar.querySelector('.progress-fill');
  progressFill.style.width = '0%';

  try {
    // 显示下载状态
    downloadBtn.disabled = true;
    downloadBtn.textContent = '⏳ 准备下载...';
    statusText.textContent = '正在获取下载链接...';
    statusText.className = 'status-text';

    console.log('开始下载请求:', video.platform, quality.label);

    // 添加超时处理
    const downloadPromise = chrome.runtime.sendMessage({
      action: 'downloadVideo',
      video: video,
      quality: quality,
      videoIndex: videoIndex,
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('请求超时，请重试')), 15000);
    });

    const response = await Promise.race([downloadPromise, timeoutPromise]);

    if (response && response.success) {
      statusText.textContent = '✅ 下载已开始，请查看浏览器下载管理器';
      statusText.className = 'status-text success';
      downloadBtn.textContent = '⏳ 下载中...';

      // 立即显示一些进度
      progressFill.style.width = '10%';

      // 监听下载进度
      if (response.downloadId) {
        listenDownloadProgress(response.downloadId, videoItem);
      } else {
        // 如果没有downloadId，模拟进度完成
        setTimeout(() => {
          progressFill.style.width = '100%';
          statusText.textContent = '✅ 下载已启动';
          downloadBtn.disabled = false;
          downloadBtn.textContent = '📥 重新下载';
        }, 2000);
      }
    } else {
      const errorMsg = response?.error || '未知错误';
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error('下载失败:', error);
    
    // 显示详细错误信息
    let errorMessage = error.message;
    if (errorMessage.includes('YouTube')) {
      errorMessage += '\n💡 建议：点击下方"用 yt-dlp 下载"按钮';
    } else if (errorMessage.includes('B站') || errorMessage.includes('哔哩哔哩')) {
      errorMessage += '\n💡 建议：在设置中配置B站Cookie或使用外部工具';
    }
    
    statusText.textContent = `❌ ${errorMessage}`;
    statusText.className = 'status-text error';
    downloadBtn.disabled = false;
    downloadBtn.textContent = '📥 重新下载';
    progressFill.style.width = '0%';
  }
}

function listenDownloadProgress(downloadId, videoItem) {
  const progressFill = videoItem.querySelector('.progress-fill');
  const statusText = videoItem.querySelector('.status-text');
  const downloadBtn = videoItem.querySelector('.download-btn');

  let checkCount = 0;
  const maxChecks = 120; // 最多检查2分钟

  const checkProgress = () => {
    checkCount++;
    
    chrome.downloads.search({ id: downloadId }, (results) => {
      if (results.length > 0) {
        const download = results[0];
        const progress = download.totalBytes > 0 
          ? (download.bytesReceived / download.totalBytes) * 100 
          : 0;

        // 更新进度条
        if (progress > 0) {
          progressFill.style.width = `${Math.max(10, progress)}%`;
        }

        console.log('下载状态:', download.state, `${Math.round(progress)}%`);

        if (download.state === 'complete') {
          progressFill.style.width = '100%';
          statusText.textContent = '✅ 下载完成';
          statusText.className = 'status-text success';
          downloadBtn.disabled = false;
          downloadBtn.textContent = '📥 重新下载';
        } else if (download.state === 'interrupted') {
          statusText.textContent = `❌ 下载中断: ${download.error || '未知错误'}`;
          statusText.className = 'status-text error';
          downloadBtn.disabled = false;
          downloadBtn.textContent = '📥 重新下载';
          progressFill.style.width = '0%';
        } else if (download.state === 'in_progress') {
          const progressText = progress > 0 
            ? `下载中... ${Math.round(progress)}%` 
            : '下载中...';
          statusText.textContent = progressText;
          
          // 继续检查
          if (checkCount < maxChecks) {
            setTimeout(checkProgress, 1000);
          }
        } else {
          // 其他状态继续检查
          if (checkCount < maxChecks) {
            setTimeout(checkProgress, 1000);
          }
        }
      } else {
        // 找不到下载记录，可能已被删除或有错误
        if (checkCount < 5) {
          setTimeout(checkProgress, 1000);
        } else {
          statusText.textContent = '❌ 下载记录丢失';
          statusText.className = 'status-text error';
          downloadBtn.disabled = false;
          downloadBtn.textContent = '📥 重新下载';
        }
      }
    });
  };

  // 立即开始检查
  setTimeout(checkProgress, 500);
}

function openWithYtDlp(videoIndex) {
  const video = currentVideos[videoIndex];
  const command = `yt-dlp "${video.url}" -f best`;

  // 复制命令到剪贴板
  navigator.clipboard.writeText(command).then(() => {
    showMessage('yt-dlp 命令已复制到剪贴板');
  });
}

function copyVideoLink(videoIndex) {
  const video = currentVideos[videoIndex];
  navigator.clipboard.writeText(video.url).then(() => {
    showMessage('视频链接已复制到剪贴板');
  });
}

function showMessage(message) {
  // 创建临时提示
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 9999;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    document.body.removeChild(toast);
  }, 2000);
}

function openSettings() {
  // 打开设置页面（可以是一个新的popup或者选项页面）
  chrome.tabs.create({
    url: chrome.runtime.getURL('options.html'),
  });
}

// 监听来自background的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'downloadProgress') {
    updateDownloadProgress(message.downloadId, message.progress);
  }
});

function updateDownloadProgress(downloadId, progress) {
  // 更新对应下载项的进度显示
  console.log(`下载进度更新: ${downloadId} - ${progress}%`);
}
