/* ============================================================
   全局交互脚本
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // 移动端导航
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav')) navLinks.classList.remove('open');
    });
  }

  // 滚动淡入动画
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // 技能条动画
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.level + '%';
        });
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-item').forEach(el => skillObserver.observe(el));

  // 数字跳动
  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    const count = parseInt(el.dataset.count);
    if (isNaN(count)) return;
    let obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(el, 0, count, 1500);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(el);
  });

  function animateCount(el, from, to, duration) {
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const val = Math.floor(from + (to - from) * easeOutExpo(p));
      el.textContent = val;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = to;
    }
    requestAnimationFrame(tick);
  }

  function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

  // 打字机效果 (首页)
  const typeTarget = document.getElementById('typewriter');
  if (typeTarget) {
    const words = JSON.parse(typeTarget.dataset.words || '[]');
    let wi = 0, ci = 0, dir = 1;
    function type() {
      const word = words[wi];
      typeTarget.textContent = word.slice(0, ci);
      if (dir === 1) {
        if (ci < word.length) { ci++; setTimeout(type, 80); }
        else { dir = -1; setTimeout(type, 2000); }
      } else {
        if (ci > 0) { ci--; setTimeout(type, 40); }
        else { dir = 1; wi = (wi + 1) % words.length; setTimeout(type, 300); }
      }
    }
    setTimeout(type, 500);
  }

  // 联系表单
  const form = document.getElementById('contact-form');
  if (form) {
    // 字数计数
    const msgTextarea = document.getElementById('message');
    const charCount = document.getElementById('char-count');
    if (msgTextarea && charCount) {
      // 初始化
      charCount.textContent = msgTextarea.value.length;
      msgTextarea.addEventListener('input', function () {
        var len = this.value.length;
        charCount.textContent = len;
        charCount.style.color = len > 180 ? '#ff6b6b' : len > 150 ? '#ffc800' : '#888';
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');

      // 前端长度校验
      if (msgTextarea && msgTextarea.value.trim().length > 200) {
        btn.textContent = '留言不能超过200字';
        btn.style.background = '#dc2626';
        setTimeout(() => { btn.textContent = '发送留言'; btn.disabled = false; btn.style.background = ''; }, 2000);
        return;
      }

      btn.disabled = true;
      btn.textContent = '发送中...';
      try {
        const res = await fetch('/admin/api.php?action=message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.querySelector('#name').value.trim(),
            email: form.querySelector('#email').value.trim(),
            message: msgTextarea ? msgTextarea.value.trim() : ''
          })
        });
        const data = await res.json();
        if (res.ok) {
          btn.textContent = '已发送';
          btn.style.background = '#059669';
          form.reset();
          if (charCount) charCount.textContent = '0';
          setTimeout(() => { btn.textContent = '发送留言'; btn.disabled = false; btn.style.background = ''; }, 2000);
        } else {
          btn.textContent = data.error || '发送失败，重试';
          btn.style.background = '#dc2626';
          btn.disabled = false;
          setTimeout(() => { btn.textContent = '发送留言'; btn.style.background = ''; }, 2500);
        }
      } catch (err) {
        btn.textContent = '网络错误，重试';
        btn.disabled = false;
      }
    });
  }
});
