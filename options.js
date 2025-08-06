// 设置页面脚本
console.log('视频下载助手 - 设置页面已加载');

// 默认配置
const DEFAULT_SETTINGS = {
  defaultQuality: '720p',
  autoDetect: true,
  showNotifications: true,
  downloadPath: '',
  filenameTemplate: '[{platform}] {title} [{quality}].{ext}',
  preventDuplicates: true,
  preferredTool: 'browser',
  ytdlpPath: '',
  ytdlpArgs: '--embed-subs --write-thumbnail',
  idmAutoStart: true,
  youtubeEnabled: true,
  youtubeSubtitles: false,
  bilibiliEnabled: true,
  bilibiliCookie: '',
  douyinEnabled: true,
  douyinWatermark: false,
  maxConcurrent: 3,
  timeout: 60,
  debugMode: false,
};

// DOM 元素
const elements = {};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  initializeElements();
  loadSettings();
  bindEvents();
});

function initializeElements() {
  // 基本设置
  elements.defaultQuality = document.getElementById('defaultQuality');
  elements.autoDetect = document.getElementById('autoDetect');
  elements.showNotifications = document.getElementById('showNotifications');

  // 下载设置
  elements.downloadPath = document.getElementById('downloadPath');
  elements.choosePathBtn = document.getElementById('choosePathBtn');
  elements.filenameTemplate = document.getElementById('filenameTemplate');
  elements.preventDuplicates = document.getElementById('preventDuplicates');

  // 外部工具
  elements.preferredTool = document.getElementById('preferredTool');
  elements.ytdlpPath = document.getElementById('ytdlpPath');
  elements.ytdlpArgs = document.getElementById('ytdlpArgs');
  elements.idmAutoStart = document.getElementById('idmAutoStart');

  // 平台设置
  elements.youtubeEnabled = document.getElementById('youtubeEnabled');
  elements.youtubeSubtitles = document.getElementById('youtubeSubtitles');
  elements.bilibiliEnabled = document.getElementById('bilibiliEnabled');
  elements.bilibiliCookie = document.getElementById('bilibiliCookie');
  elements.douyinEnabled = document.getElementById('douyinEnabled');
  elements.douyinWatermark = document.getElementById('douyinWatermark');

  // 高级设置
  elements.maxConcurrent = document.getElementById('maxConcurrent');
  elements.timeout = document.getElementById('timeout');
  elements.debugMode = document.getElementById('debugMode');

  // 按钮
  elements.saveBtn = document.getElementById('saveBtn');
  elements.resetBtn = document.getElementById('resetBtn');
  elements.exportBtn = document.getElementById('exportBtn');
  elements.importBtn = document.getElementById('importBtn');
  elements.importFile = document.getElementById('importFile');

  // 配置区域
  elements.ytdlpConfig = document.getElementById('ytdlpConfig');
  elements.idmConfig = document.getElementById('idmConfig');
}

function bindEvents() {
  // 工具选择变化
  elements.preferredTool.addEventListener('change', updateToolConfig);

  // 按钮事件
  elements.saveBtn.addEventListener('click', saveSettings);
  elements.resetBtn.addEventListener('click', resetSettings);
  elements.exportBtn.addEventListener('click', exportSettings);
  elements.importBtn.addEventListener('click', () => {
    elements.importFile.click();
  });
  elements.importFile.addEventListener('change', importSettings);

  // 文件夹选择（注意：Chrome扩展的文件访问限制）
  elements.choosePathBtn.addEventListener('click', () => {
    showMessage('浏览器扩展无法直接选择文件夹，请手动输入路径', 'error');
  });
}

// 加载设置
async function loadSettings() {
  try {
    const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    
    // 基本设置
    elements.defaultQuality.value = settings.defaultQuality;
    elements.autoDetect.checked = settings.autoDetect;
    elements.showNotifications.checked = settings.showNotifications;

    // 下载设置
    elements.downloadPath.value = settings.downloadPath;
    elements.filenameTemplate.value = settings.filenameTemplate;
    elements.preventDuplicates.checked = settings.preventDuplicates;

    // 外部工具
    elements.preferredTool.value = settings.preferredTool;
    elements.ytdlpPath.value = settings.ytdlpPath;
    elements.ytdlpArgs.value = settings.ytdlpArgs;
    elements.idmAutoStart.checked = settings.idmAutoStart;

    // 平台设置
    elements.youtubeEnabled.checked = settings.youtubeEnabled;
    elements.youtubeSubtitles.checked = settings.youtubeSubtitles;
    elements.bilibiliEnabled.checked = settings.bilibiliEnabled;
    elements.bilibiliCookie.value = settings.bilibiliCookie;
    elements.douyinEnabled.checked = settings.douyinEnabled;
    elements.douyinWatermark.checked = settings.douyinWatermark;

    // 高级设置
    elements.maxConcurrent.value = settings.maxConcurrent;
    elements.timeout.value = settings.timeout;
    elements.debugMode.checked = settings.debugMode;

    // 更新工具配置显示
    updateToolConfig();
    
    console.log('设置已加载:', settings);
  } catch (error) {
    console.error('加载设置失败:', error);
    showMessage('加载设置失败', 'error');
  }
}

// 保存设置
async function saveSettings() {
  try {
    const settings = {
      // 基本设置
      defaultQuality: elements.defaultQuality.value,
      autoDetect: elements.autoDetect.checked,
      showNotifications: elements.showNotifications.checked,

      // 下载设置
      downloadPath: elements.downloadPath.value,
      filenameTemplate: elements.filenameTemplate.value,
      preventDuplicates: elements.preventDuplicates.checked,

      // 外部工具
      preferredTool: elements.preferredTool.value,
      ytdlpPath: elements.ytdlpPath.value,
      ytdlpArgs: elements.ytdlpArgs.value,
      idmAutoStart: elements.idmAutoStart.checked,

      // 平台设置
      youtubeEnabled: elements.youtubeEnabled.checked,
      youtubeSubtitles: elements.youtubeSubtitles.checked,
      bilibiliEnabled: elements.bilibiliEnabled.checked,
      bilibiliCookie: elements.bilibiliCookie.value,
      douyinEnabled: elements.douyinEnabled.checked,
      douyinWatermark: elements.douyinWatermark.checked,

      // 高级设置
      maxConcurrent: parseInt(elements.maxConcurrent.value),
      timeout: parseInt(elements.timeout.value),
      debugMode: elements.debugMode.checked,
    };

    await chrome.storage.sync.set(settings);
    showMessage('设置已保存成功！', 'success');
    console.log('设置已保存:', settings);
  } catch (error) {
    console.error('保存设置失败:', error);
    showMessage('保存设置失败', 'error');
  }
}

// 重置设置
async function resetSettings() {
  if (confirm('确定要重置所有设置为默认值吗？')) {
    try {
      await chrome.storage.sync.clear();
      await chrome.storage.sync.set(DEFAULT_SETTINGS);
      await loadSettings();
      showMessage('设置已重置为默认值', 'success');
    } catch (error) {
      console.error('重置设置失败:', error);
      showMessage('重置设置失败', 'error');
    }
  }
}

// 导出设置
async function exportSettings() {
  try {
    const settings = await chrome.storage.sync.get();
    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `video-downloader-settings-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showMessage('设置已导出', 'success');
  } catch (error) {
    console.error('导出设置失败:', error);
    showMessage('导出设置失败', 'error');
  }
}

// 导入设置
function importSettings(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const settings = JSON.parse(e.target.result);
      await chrome.storage.sync.set(settings);
      await loadSettings();
      showMessage('设置已导入成功！', 'success');
    } catch (error) {
      console.error('导入设置失败:', error);
      showMessage('导入设置失败，请检查文件格式', 'error');
    }
  };
  reader.readAsText(file);
  
  // 清空文件输入
  event.target.value = '';
}

// 更新工具配置显示
function updateToolConfig() {
  const selectedTool = elements.preferredTool.value;
  
  // 隐藏所有配置
  elements.ytdlpConfig.style.display = 'none';
  elements.idmConfig.style.display = 'none';
  
  // 显示对应配置
  switch (selectedTool) {
    case 'yt-dlp':
      elements.ytdlpConfig.style.display = 'block';
      break;
    case 'idm':
      elements.idmConfig.style.display = 'block';
      break;
  }
}

// 显示消息
function showMessage(text, type = 'success') {
  // 移除现有消息
  const existingMessage = document.querySelector('.message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // 创建新消息
  const message = document.createElement('div');
  message.className = `message ${type}`;
  message.textContent = text;
  
  // 插入到内容区域顶部
  const content = document.querySelector('.content');
  content.insertBefore(message, content.firstChild);
  
  // 显示动画
  setTimeout(() => {
    message.classList.add('show');
  }, 10);
  
  // 自动隐藏
  setTimeout(() => {
    if (message.parentNode) {
      message.remove();
    }
  }, 5000);
}

// 验证设置
function validateSettings() {
  const maxConcurrent = parseInt(elements.maxConcurrent.value);
  const timeout = parseInt(elements.timeout.value);
  
  if (maxConcurrent < 1 || maxConcurrent > 10) {
    showMessage('最大同时下载数必须在1-10之间', 'error');
    return false;
  }
  
  if (timeout < 10 || timeout > 300) {
    showMessage('网络超时必须在10-300秒之间', 'error');
    return false;
  }
  
  return true;
}

// 实时保存功能（可选）
function enableAutoSave() {
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('change', () => {
      if (validateSettings()) {
        saveSettings();
      }
    });
  });
}