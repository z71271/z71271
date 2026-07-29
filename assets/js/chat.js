/**
 * ZJY AI 智能体 — 首页聊天组件
 * 右下角浮动气泡 + 流式对话
 */
(function () {
  'use strict';

  // ============================================================
  // 预设引导问题
  // ============================================================
  var SUGGESTIONS = [
    '郑敬耀擅长哪些技术？',
    '他做过什么AI相关的项目？',
    '他的实习/工作经历有哪些？',
    '他的教育背景是什么？',
    '如何联系他？',
    '他获得过哪些荣誉？',
  ];

  // ============================================================
  // 构建 DOM
  // ============================================================
  var container = document.createElement('div');
  container.id = 'z71-chat';
  container.innerHTML =
    '<div class="z71-chat-bubble" id="z71-bubble" title="AI 智能助手">' +
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>' +
      '</svg>' +
    '</div>' +
    '<div class="z71-chat-hint" id="z71-hint">AI 问答</div>' +
    '<div class="z71-chat-panel" id="z71-panel">' +
      '<div class="z71-chat-header">' +
        '<div class="z71-chat-header-left">' +
          '<span class="z71-chat-avatar">ZJY</span>' +
          '<div>' +
            '<div class="z71-chat-header-title">AI 智能助手</div>' +
            '<div class="z71-chat-header-sub">基于个人知识库 · DeepSeek</div>' +
          '</div>' +
        '</div>' +
        '<button class="z71-chat-close" id="z71-close" aria-label="关闭">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
            '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<div class="z71-chat-suggestions" id="z71-suggestions"></div>' +
      '<div class="z71-chat-messages" id="z71-messages">' +
        '<div class="z71-msg z71-msg-ai">' +
          '你好！我是郑敬耀的 AI 数字分身 👋<br>你可以问我任何关于他的问题——技术能力、项目经历、实习背景、联系方式等等。试试点击下方的问题，或者直接输入你想了解的。' +
        '</div>' +
      '</div>' +
      '<div class="z71-chat-input-wrap">' +
        '<input type="text" class="z71-chat-input" id="z71-input" placeholder="输入你的问题…" maxlength="500" autocomplete="off">' +
        '<button class="z71-chat-send" id="z71-send" aria-label="发送">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
            '<line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>' +
          '</svg>' +
        '</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(container);

  // ============================================================
  // DOM 引用
  // ============================================================
  var bubble = document.getElementById('z71-bubble');
  var hint = document.getElementById('z71-hint');
  var panel = document.getElementById('z71-panel');
  var closeBtn = document.getElementById('z71-close');
  var messages = document.getElementById('z71-messages');
  var suggestions = document.getElementById('z71-suggestions');
  var input = document.getElementById('z71-input');
  var sendBtn = document.getElementById('z71-send');
  var isOpen = false;
  var isStreaming = false;

  // ============================================================
  // 渲染引导问题
  // ============================================================
  SUGGESTIONS.forEach(function (q) {
    var tag = document.createElement('span');
    tag.className = 'z71-suggestion-tag';
    tag.textContent = q;
    tag.addEventListener('click', function () { sendMessage(q); });
    suggestions.appendChild(tag);
  });

  // ============================================================
  // 打开/关闭面板
  // ============================================================
  function openPanel() {
    isOpen = true;
    panel.classList.add('z71-open');
    bubble.classList.add('z71-hidden');
    hint.classList.add('z71-hidden');
    setTimeout(function () { input.focus(); }, 300);
  }

  function closePanel() {
    isOpen = false;
    panel.classList.remove('z71-open');
    bubble.classList.remove('z71-hidden');
    hint.classList.remove('z71-hidden');
  }

  bubble.addEventListener('click', openPanel);
  hint.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);

  // ============================================================
  // 发送消息
  // ============================================================
  function sendMessage(text) {
    if (isStreaming) return;
    var msg = (typeof text === 'string') ? text : input.value.trim();
    if (!msg) return;

    isStreaming = true;
    if (typeof text !== 'string') input.value = '';
    sendBtn.disabled = true;
    input.disabled = true;

    // 如果输入的内容和某个引导问题一样且还没发过，也是用 sendMessage
    appendMessage('user', msg);
    var aiMsg = appendMessage('ai', '');

    // 调用 SSE 流式 API
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg }),
    })
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return readStream(response, aiMsg);
      })
      .catch(function (err) {
        aiMsg.innerHTML = '<span class="z71-msg-error">抱歉，出了点问题：' + escapeHtml(err.message) + '。请稍后重试。</span>';
        finishStream();
      });
  }

  // ============================================================
  // 读取 SSE 流
  // ============================================================
  function readStream(response, aiMsg) {
    var reader = response.body.getReader();
    var decoder = new TextDecoder();
    var buffer = '';
    var fullText = '';

    function pump() {
      return reader.read().then(function (result) {
        if (result.done) {
          finishStream();
          return;
        }

        buffer += decoder.decode(result.value, { stream: true });
        var lines = buffer.split('\n');
        // 最后一个可能不完整，留在 buffer
        buffer = lines.pop() || '';

        for (var i = 0; i < lines.length; i++) {
          var line = lines[i];
          if (line.indexOf('data: ') !== 0) continue;
          var dataStr = line.slice(6);
          if (dataStr === '[DONE]') {
            finishStream();
            return;
          }
          try {
            var data = JSON.parse(dataStr);
            if (data.token) {
              fullText += data.token;
              aiMsg.innerHTML = formatMarkdown(fullText);
              scrollToBottom();
            }
            if (data.error) {
              aiMsg.innerHTML = '<span class="z71-msg-error">' + escapeHtml(data.error) + '</span>';
              finishStream();
              return;
            }
          } catch (e) {
            // 忽略解析失败的行
          }
        }

        return pump();
      });
    }

    return pump();
  }

  function finishStream() {
    isStreaming = false;
    sendBtn.disabled = false;
    input.disabled = false;
    input.focus();
  }

  // ============================================================
  // 添加消息气泡
  // ============================================================
  function appendMessage(role, text) {
    var div = document.createElement('div');
    div.className = 'z71-msg z71-msg-' + role;
    if (text) div.innerHTML = formatMarkdown(text);
    messages.appendChild(div);
    scrollToBottom();
    return div;
  }

  function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  // ============================================================
  // 简易 Markdown 格式化（加粗、链接、换行）
  // ============================================================
  function formatMarkdown(text) {
    return escapeHtml(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\n/g, '<br>');
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ============================================================
  // 事件绑定
  // ============================================================
  sendBtn.addEventListener('click', function () { sendMessage(); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // ESC 关闭面板
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) closePanel();
  });
})();
