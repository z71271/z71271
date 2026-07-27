# 郑敬耀 — 网站AI板块框架 + Python环境 — 周五～周日

> 目标：网站新增AI能力页面 + 导航栏更新 + Python开发环境就绪
> 预计时间：3天（每天3-4小时）
> 产出：ai.html + ai.json + 全站导航更新 + Python开发环境

---

## 周五（约3小时）｜ 新建 AI 能力展示页面

---

### 步骤1：拉取网站最新代码到本地（15分钟）

由于之前 Docker 练习都在服务器上，现在回到网站开发。先确保本地有最新代码：

```bash
cd ~/Desktop/网站代码/z71.z71.pw

# 拉取 GitHub 上最新版本（包含你之前推的 Dockerfile 等）
git pull origin main

# 看看有哪些文件，确认网站结构
ls
# 应该看到：index.html tech.html sales.html contact.html assets/ Dockerfile 等
```

### 步骤1.1：先看看现有页面长什么样（10分钟）

用浏览器打开你本地的 `index.html`（直接双击文件），看布局和风格。然后打开 `tech.html` 看技术简历页的 HTML 结构——我们要让 `ai.html` 的风格和它保持一致。

关键观察点：
- 页面用了什么字体？（JetBrains Mono）
- 主色调是什么？（深色背景 + terminal 风格）
- 数据是怎么加载的？（fetch JSON）
- 导航栏在哪个位置？

---

### 步骤2：先创建 ai.json 数据文件（30分钟）

> 先有数据，再写页面——这样页面写完就能看到效果。

```bash
# 进入数据目录
cd ~/Desktop/网站代码/z71.z71.pw/assets/data/
```

创建 `ai.json`：

```bash
cat > ai.json << 'EOF'
{
  "pageTitle": "AI 能力",
  "subtitle": "本地AI部署 & 工程化应用",
  "sections": [
    {
      "id": "toolchain",
      "title": "AI 工具链",
      "icon": "🔧",
      "content": {
        "text": "基于 RTX 3080 搭建了一套完整的本地 AI 开发环境，覆盖模型部署、API 服务化、知识库应用。",
        "items": [
          {
            "name": "Ollama",
            "description": "本地大语言模型运行环境，支持 qwen2.5、llama3.1、deepseek-r1 等多模型并行部署",
            "status": "已部署",
            "link": "https://ollama.com"
          },
          {
            "name": "Open WebUI",
            "description": "类 ChatGPT 交互界面，Docker 部署，连接本地 Ollama 模型，支持对话历史管理",
            "status": "已部署",
            "link": "https://github.com/open-webui/open-webui"
          },
          {
            "name": "DeepSeek API",
            "description": "通过 API 调用 DeepSeek 大模型，用于 Claude Desktop/Code 的底层推理",
            "status": "已接入",
            "link": "https://platform.deepseek.com"
          },
          {
            "name": "OpenClaw",
            "description": "AI 工具集成平台，部署在本地环境，用于多工具协同调用",
            "status": "已部署",
            "link": ""
          }
        ]
      }
    },
    {
      "id": "local-deploy",
      "title": "本地部署方案",
      "icon": "🖥️",
      "content": {
        "text": "在本地 PC（i5-14600KF / 32G RAM / RTX 3080）上搭建了完整的本地 AI 推理环境。",
        "architecture": {
          "description": "本地 AI 推理架构",
          "layers": [
            {
              "name": "用户层",
              "tools": ["Open WebUI（Chat界面）", "Claude Desktop/Code", "自定义 Python 脚本"]
            },
            {
              "name": "API 网关层",
              "tools": ["Ollama API（localhost:11434）", "DeepSeek API", "自定义 FastAPI 网关（开发中）"]
            },
            {
              "name": "模型推理层",
              "tools": ["Ollama Runtime", "qwen2.5:7b", "llama3.1:8b", "deepseek-r1:8b"]
            },
            {
              "name": "硬件层",
              "tools": ["RTX 3080（10GB VRAM）", "i5-14600KF", "32GB DDR5"]
            }
          ]
        }
      }
    },
    {
      "id": "rag-knowledge",
      "title": "RAG 知识库",
      "icon": "📚",
      "content": {
        "text": "正在搭建基于本地模型的知识库问答系统。",
        "plan": [
          "部署 Dify 社区版（Docker）连接本地 Ollama 模型",
          "上传个人技术笔记/简历作为知识库",
          "实现私有知识的智能问答",
          "为后续面试准备可演示的 RAG Demo"
        ],
        "status": "规划中"
      }
    },
    {
      "id": "skills",
      "title": "AI 相关技能",
      "icon": "⚡",
      "content": {
        "items": [
          { "name": "本地模型部署", "level": "熟练" },
          { "name": "Ollama 模型管理", "level": "熟练" },
          { "name": "API 调用与集成", "level": "熟练" },
          { "name": "Docker 容器化部署", "level": "掌握中" },
          { "name": "FastAPI 后端开发", "level": "学习中" },
          { "name": "RAG 知识库搭建", "level": "学习中" },
          { "name": "ComfyUI/Stable Diffusion", "level": "规划中" }
        ]
      }
    },
    {
      "id": "projects",
      "title": "AI 项目",
      "icon": "🚀",
      "content": {
        "items": [
          {
            "name": "网站容器化部署",
            "description": "使用 Dockerfile + docker-compose 将个人网站打包成 Nginx Alpine 镜像",
            "tech": ["Docker", "Nginx", "docker-compose"],
            "status": "已完成",
            "repo": "https://github.com/z71271/z71271"
          },
          {
            "name": "本地 AI API 网关",
            "description": "用 FastAPI 封装 Ollama 调用，提供统一的模型切换和流式输出接口",
            "tech": ["Python", "FastAPI", "Ollama", "SSE"],
            "status": "开发中",
            "repo": ""
          },
          {
            "name": "Ollama 多模型部署",
            "description": "在本地 RTX 3080 上部署 qwen2.5、llama3.1、deepseek-r1 三个模型，通过 Open WebUI 统一访问",
            "tech": ["Ollama", "Open WebUI", "Docker"],
            "status": "已完成",
            "repo": ""
          }
        ]
      }
    }
  ]
}
EOF
```

提交到 GitHub：

```bash
git add assets/data/ai.json
git commit -m "添加AI能力页面数据文件 ai.json"
git push origin main
```

---

### 步骤3：创建 ai.html 页面（1.5小时）

> 让 ai.html 的风格和现有页面保持一致——terminal/开发者风格、JetBrains Mono 字体、深色背景。

先看一下 `tech.html` 的结构来了解现有风格：

```bash
# 查看 tech.html 的前100行，了解头部和导航栏写法
head -100 tech.html
```

然后在网站根目录创建 `ai.html`：

```bash
cd ~/Desktop/网站代码/z71.z71.pw
```

```html
cat > ai.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI 能力 | ZJY</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* ===== AI页面专属样式 ===== */
        .ai-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .ai-header {
            text-align: center;
            margin-bottom: 50px;
            padding: 30px 0;
            border-bottom: 1px solid rgba(0, 212, 255, 0.2);
        }

        .ai-header h1 {
            font-size: 2.2em;
            color: #00d4ff;
            margin-bottom: 10px;
        }

        .ai-header .subtitle {
            color: #888;
            font-size: 0.9em;
            letter-spacing: 1px;
        }

        .ai-section {
            margin-bottom: 40px;
            padding: 25px 30px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.02);
            transition: border-color 0.3s;
        }

        .ai-section:hover {
            border-color: rgba(0, 212, 255, 0.25);
        }

        .ai-section h2 {
            color: #00d4ff;
            font-size: 1.3em;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .ai-section .section-desc {
            color: #aaa;
            font-size: 0.9em;
            margin-bottom: 20px;
            line-height: 1.6;
        }

        /* 工具链卡片 */
        .tool-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 15px;
        }

        .tool-card {
            padding: 18px;
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 6px;
            background: rgba(0, 0, 0, 0.2);
        }

        .tool-card .tool-name {
            color: #eaeaea;
            font-size: 1em;
            font-weight: 600;
            margin-bottom: 6px;
        }

        .tool-card .tool-desc {
            color: #888;
            font-size: 0.8em;
            line-height: 1.5;
            margin-bottom: 8px;
        }

        .tool-card .tool-status {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 3px;
            font-size: 0.7em;
            font-weight: 500;
        }

        .status-deployed { background: rgba(0, 212, 255, 0.15); color: #00d4ff; }
        .status-connected { background: rgba(0, 255, 100, 0.15); color: #00ff64; }
        .status-developing { background: rgba(255, 200, 0, 0.15); color: #ffc800; }
        .status-planning { background: rgba(255, 255, 255, 0.08); color: #999; }

        /* 架构层级 */
        .arch-layers {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .arch-layer {
            padding: 15px 20px;
            border-left: 3px solid #00d4ff;
            background: rgba(0, 212, 255, 0.03);
            border-radius: 0 6px 6px 0;
        }

        .arch-layer .layer-name {
            color: #00d4ff;
            font-size: 0.8em;
            font-weight: 600;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .arch-layer .layer-tools {
            color: #aaa;
            font-size: 0.85em;
        }

        /* 技能条 */
        .skill-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 10px;
        }

        .skill-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 14px;
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 4px;
            font-size: 0.85em;
        }

        .skill-item .skill-name { color: #eaeaea; }
        .skill-item .skill-level { color: #00d4ff; font-weight: 500; }

        /* 项目卡片 */
        .project-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .project-card {
            padding: 18px;
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 6px;
            background: rgba(0, 0, 0, 0.15);
        }

        .project-card .proj-name {
            color: #eaeaea;
            font-size: 1em;
            font-weight: 600;
            margin-bottom: 5px;
        }

        .project-card .proj-desc {
            color: #888;
            font-size: 0.8em;
            line-height: 1.5;
            margin-bottom: 10px;
        }

        .project-card .proj-tech {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 8px;
        }

        .project-card .proj-tech span {
            padding: 2px 8px;
            border-radius: 3px;
            background: rgba(0, 212, 255, 0.1);
            color: #00d4ff;
            font-size: 0.7em;
        }

        .project-card .proj-link {
            color: #00d4ff;
            font-size: 0.8em;
            text-decoration: none;
        }

        .project-card .proj-link:hover {
            text-decoration: underline;
        }

        /* 规划中标签 */
        .plan-list {
            color: #888;
            font-size: 0.85em;
            line-height: 2;
            padding-left: 20px;
        }

        .plan-list li {
            margin-bottom: 4px;
        }

        .plan-list li::marker {
            color: #00d4ff;
        }

        /* 响应式 */
        @media (max-width: 768px) {
            .tool-grid {
                grid-template-columns: 1fr;
            }
            .skill-list {
                grid-template-columns: 1fr;
            }
            .ai-section {
                padding: 18px 15px;
            }
        }
    </style>
</head>
<body>
    <!-- 导航栏 -->
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-logo">&lt;ZJY/&gt;</a>
            <ul class="nav-links">
                <li><a href="/">首页</a></li>
                <li><a href="/tech.html">技术简历</a></li>
                <li><a href="/ai.html" class="active">AI 能力</a></li>
                <li><a href="/sales.html">销售简历</a></li>
                <li><a href="/contact.html">联系</a></li>
            </ul>
        </div>
    </nav>

    <!-- 加载中 -->
    <div id="loading" style="text-align:center; padding:100px; color:#888;">
        <p>Loading...</p>
    </div>

    <!-- AI 内容区域 -->
    <div id="ai-content" class="ai-container" style="display:none;">
        <div class="ai-header">
            <h1 id="page-title">AI 能力</h1>
            <p class="subtitle" id="page-subtitle"></p>
        </div>
        <div id="sections-container"></div>
    </div>

    <script>
        // 加载 ai.json 数据并渲染页面
        fetch('assets/data/ai.json')
            .then(res => res.json())
            .then(data => {
                document.getElementById('page-title').textContent = data.pageTitle;
                document.getElementById('page-subtitle').textContent = data.subtitle;
                renderSections(data.sections);
                document.getElementById('loading').style.display = 'none';
                document.getElementById('ai-content').style.display = 'block';
            })
            .catch(err => {
                document.getElementById('loading').innerHTML = '<p style="color:#ff5555;">数据加载失败，请稍后重试</p>';
                console.error('Failed to load ai.json:', err);
            });

        function renderSections(sections) {
            const container = document.getElementById('sections-container');
            sections.forEach(section => {
                const sectionEl = document.createElement('div');
                sectionEl.className = 'ai-section';
                sectionEl.id = section.id;
                sectionEl.innerHTML = `
                    <h2>${section.icon || ''} ${section.title}</h2>
                    <p class="section-desc">${section.content.text || ''}</p>
                    ${renderSectionContent(section.content)}
                `;
                container.appendChild(sectionEl);
            });
        }

        function renderSectionContent(content) {
            let html = '';

            // 工具链 / 项目 用卡片展示
            if (content.items && content.items.length > 0) {
                const isToolCard = content.items[0].status !== undefined && content.items[0].description !== undefined;
                const isProject = content.items[0].tech !== undefined;
                const isSkill = content.items[0].level !== undefined;

                if (isProject) {
                    html += '<div class="project-list">';
                    content.items.forEach(p => {
                        const techTags = (p.tech || []).map(t => `<span>${t}</span>`).join('');
                        const repo = p.repo ? `<a href="${p.repo}" class="proj-link" target="_blank">GitHub →</a>` : '';
                        const statusClass = p.status === '已完成' ? 'status-deployed' : p.status === '开发中' ? 'status-developing' : 'status-planning';
                        html += `
                            <div class="project-card">
                                <div class="proj-name">${p.name} <span class="tool-status ${statusClass}">${p.status}</span></div>
                                <div class="proj-desc">${p.description}</div>
                                <div class="proj-tech">${techTags}</div>
                                ${repo}
                            </div>
                        `;
                    });
                    html += '</div>';
                } else if (isToolCard) {
                    html += '<div class="tool-grid">';
                    content.items.forEach(tool => {
                        const statusClass = tool.status === '已部署' ? 'status-deployed' : tool.status === '已接入' ? 'status-connected' : tool.status === '开发中' ? 'status-developing' : 'status-planning';
                        const link = tool.link ? `<br><a href="${tool.link}" target="_blank" style="color:#00d4ff;font-size:0.7em;text-decoration:none;">了解更多 →</a>` : '';
                        html += `
                            <div class="tool-card">
                                <div class="tool-name">${tool.name} <span class="tool-status ${statusClass}">${tool.status}</span></div>
                                <div class="tool-desc">${tool.description}${link}</div>
                            </div>
                        `;
                    });
                    html += '</div>';
                } else if (isSkill) {
                    html += '<div class="skill-list">';
                    content.items.forEach(skill => {
                        html += `
                            <div class="skill-item">
                                <span class="skill-name">${skill.name}</span>
                                <span class="skill-level">${skill.level}</span>
                            </div>
                        `;
                    });
                    html += '</div>';
                }
            }

            // 架构层级图
            if (content.architecture) {
                html += '<div class="arch-layers">';
                content.architecture.layers.forEach(layer => {
                    html += `
                        <div class="arch-layer">
                            <div class="layer-name">${layer.name}</div>
                            <div class="layer-tools">${layer.tools.join(' &nbsp;|&nbsp; ')}</div>
                        </div>
                    `;
                });
                html += '</div>';
            }

            // 计划列表
            if (content.plan) {
                html += '<ul class="plan-list">';
                content.plan.forEach(item => {
                    html += `<li>${item}</li>`;
                });
                html += '</ul>';
            }

            return html;
        }
    </script>
</body>
</html>
HTMLEOF
```

---

### 步骤4：本地预览测试（15分钟）

```bash
# 最简单的本地预览方式：直接用 Python 起一个临时 HTTP 服务
# 在网站根目录执行
cd ~/Desktop/网站代码/z71.z71.pw
python -m http.server 8000
```

打开浏览器访问 `http://localhost:8000/ai.html`，检查：

- [ ] 页面风格和现有页面一致
- [ ] 所有数据从 ai.json 加载成功
- [ ] 导航栏能正常跳转
- [ ] 工具链卡片、技能列表、项目卡片都正确显示

测试完按 `Ctrl+C` 停掉服务。

---

## 周六（约3小时）｜ 导航栏更新 + 页面完善

---

### 步骤5：更新所有页面的导航栏（1小时）

> 现有4个页面的导航栏需要统一加上"AI 能力"入口。

你需要更新这些页面：`index.html`、`tech.html`、`sales.html`、`contact.html`

每个页面的导航栏部分，找到类似这样的代码：

```html
<ul class="nav-links">
    <li><a href="/">首页</a></li>
    <li><a href="/tech.html">技术简历</a></li>
    <li><a href="/sales.html">销售简历</a></li>
    <li><a href="/contact.html">联系</a></li>
</ul>
```

改成：

```html
<ul class="nav-links">
    <li><a href="/">首页</a></li>
    <li><a href="/tech.html">技术简历</a></li>
    <li><a href="/ai.html">AI 能力</a></li>
    <li><a href="/sales.html">销售简历</a></li>
    <li><a href="/contact.html">联系</a></li>
</ul>
```

**快速操作**（在 Git Bash 里）：

由于你的网站没有模板引擎，需要手动改4个文件。一个个来：

```bash
cd ~/Desktop/网站代码/z71.z71.pw

# 1. 改 index.html
# 找到 <a href="/tech.html">技术简历</a> 这行，在它下面添加 AI 链接
# 用你习惯的编辑器打开修改（VSCode 或直接在命令行用 sed）

# 2-4. tech.html / sales.html / contact.html 也做同样修改
```

> 💡 如果你的编辑器支持多文件搜索替换（VSCode 可以 Ctrl+Shift+H 全局替换），搜 `<li><a href="/tech.html">技术简历</a></li>`，替换为 `<li><a href="/tech.html">技术简历</a></li>\n    <li><a href="/ai.html">AI 能力</a></li>`，一次性改完4个文件。

如果不想手动改，我可以帮你写一个脚本——告诉我你用不用 VSCode？

#### 验证导航栏

```bash
cd ~/Desktop/网站代码/z71.z71.pw
python -m http.server 8000
```

逐一打开每个页面，确认导航栏都有"AI 能力"链接，且点击后能跳到 `ai.html`。

---

### 步骤6：更新首页，加入 AI 标签（30分钟）

打开 `index.html`，在 typewriter 动画或自我介绍区域加入 AI 相关关键词。找类似这样的代码：

```javascript
// typewriter 数组，类似：
const words = ['网络工程师', 'Web 开发者', 'Linux 运维'];
```

在后面加上 AI 相关的词：

```javascript
const words = ['网络工程师', 'Web 开发者', 'Linux 运维', 'AI 应用开发', '本地 AI 部署'];
```

同时在自我介绍段落里加一句话，比如：

```html
<p>热衷于 AI 本地部署与工程化应用。目前在 RTX 3080 上搭建了完整的本地 AI 推理环境。</p>
```

具体改哪里取决于你 index.html 的实际结构——按 Ctrl+F 搜一下 "typewriter" 或 "打字" 找相关代码。

---

### 步骤7：更新 tech.html 技术简历（30分钟）

打开 `tech.html` 对应的数据文件—通常是 `assets/data/tech.json`：

```bash
cat assets/data/tech.json
```

在"专业技能"区域（类似 `skills` 数组），加上 AI 相关技能：

```json
{ "name": "AI 本地部署", "level": "掌握", "tags": ["Ollama", "Open WebUI", "Docker"] },
{ "name": "Python 后端开发", "level": "学习中", "tags": ["FastAPI", "REST API"] },
{ "name": "Docker 容器化", "level": "掌握", "tags": ["Dockerfile", "docker-compose"] }
```

---

### 步骤8：提交到 GitHub 并在服务器上验证（30分钟）

```bash
cd ~/Desktop/网站代码/z71.z71.pw

# 查看改了哪些文件
git status

# 添加所有变更
git add ai.html assets/data/ai.json index.html tech.html sales.html contact.html

# 提交
git commit -m "新增AI能力页面、更新全站导航栏、首页加入AI标签"

# 推送到 GitHub
git push origin main
```

**服务器同步**：

```bash
ssh root@8.138.195.245
cd /www/wwwroot/z71.z71.pw
git pull origin main
```

然后用浏览器访问 `http://8.138.195.245/ai.html`，确认一切正常。

---

## 周日（约3小时）｜ Python 环境 + 选做任务

---

### 步骤9：本地 PC 搭建 Python 开发环境（1小时）

#### 9.1 检查是否已装 Python

```bash
# 在 PowerShell 或 Git Bash 中执行
python --version
# 或
python3 --version
```

如果没装或版本低于 3.11，去 https://www.python.org/downloads/ 下载最新版（3.12.x）。

安装时注意：**勾选 "Add Python to PATH"**（非常重要！）。

#### 9.2 创建虚拟环境

虚拟环境让每个项目的依赖相互隔离，不互相影响——这是 Python 开发的基本功。

```bash
# 在用户目录下创建一个统一的项目目录
mkdir ~/python-projects
cd ~/python-projects

# 创建虚拟环境（venv = virtual environment）
python -m venv venv

# 目录结构：
# python-projects/
#   └── venv/
#       ├── Scripts/      ← Python 解释器、pip 等
#       ├── Lib/          ← 安装的包
#       └── pyvenv.cfg
```

#### 9.3 激活虚拟环境

```bash
# Windows Git Bash 中激活
source ~/python-projects/venv/Scripts/activate

# 激活成功后，命令行前面会出现 (venv) 标记：
# (venv) w1912@DESKTOP MINGW64 ~/python-projects
```

#### 9.4 安装常用包

```bash
# 确保 pip 是最新版
pip install --upgrade pip

# AI/API 相关
pip install openai          # OpenAI 兼容客户端（Ollama、DeepSeek 都兼容这个接口）
pip install requests        # HTTP 请求库（Python 版 curl）

# Web 后端
pip install fastapi         # 高性能 Python Web 框架
pip install uvicorn         # ASGI 服务器（跑 FastAPI 用）
pip install pydantic        # 数据验证（FastAPI 自带，但显式装一下）

# 实用工具
pip install python-dotenv   # 读取 .env 环境变量文件
pip install httpx           # 异步 HTTP 客户端（FastAPI 依赖）

# 网络/自动化（第3周会用）
pip install paramiko        # SSH 客户端（网络设备批量配置）
pip install beautifulsoup4  # HTML 解析（爬虫用）
pip install lxml            # XML/HTML 解析加速

# 验证安装
pip list
```

#### 9.5 导出依赖列表

```bash
pip freeze > requirements.txt
cat requirements.txt
```

`requirements.txt` 记录了项目用了哪些包及版本号。别人（或你自己换台电脑）只要 `pip install -r requirements.txt` 就能装完所有依赖。这是 GitHub 项目标配。

#### 9.6 写一个简单的测试脚本验证环境

```bash
cat > test_env.py << 'EOF'
#!/usr/bin/env python3
"""
测试 Python 开发环境是否就绪
"""

import sys
print(f"✅ Python 版本: {sys.version}")

try:
    import fastapi
    print(f"✅ FastAPI 版本: {fastapi.__version__}")
except ImportError:
    print("❌ FastAPI 未安装")

try:
    import openai
    print(f"✅ OpenAI 库已安装")
except ImportError:
    print("❌ OpenAI 库未安装")

try:
    import requests
    print(f"✅ Requests 库已安装")
except ImportError:
    print("❌ Requests 库未安装")

try:
    import uvicorn
    print(f"✅ Uvicorn 已安装")
except ImportError:
    print("❌ Uvicorn 未安装")

print("\n🎉 Python 开发环境就绪！")
EOF

python test_env.py
```

应该看到5个 ✅。

#### 9.7 退出虚拟环境

```bash
deactivate
# (venv) 标记消失
```

---

### 步骤10（选做）：调研 Markdown 渲染方案（1小时）

> 这个调研是为第2周的"技术笔记板块"做准备。要不要现在做看时间。

#### 结论先行（省时间版）

用 **marked.js**——这是最简单、最轻量的方案。调研不用看了，直接记结论：

1. 引入 marked.js 只需要一行 CDN：
```html
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
```

2. 渲染 Markdown 只需要3行代码：
```javascript
fetch('/notes/ollama-deploy-guide.md')
    .then(res => res.text())
    .then(md => {
        document.getElementById('content').innerHTML = marked.parse(md);
    });
```

3. 优点：零依赖、5KB 体积、GitHub 同款渲染风格

#### 验证 Demo（如果时间充裕再做）

在网站目录下新建一个测试文件：

```bash
cd ~/Desktop/网站代码/z71.z71.pw
mkdir -p notes

cat > notes/test.md << 'EOF'
# Dockerfile 学习笔记

## FROM 指令
指定基础镜像。**所有 Dockerfile 的第一行必须是 FROM。**

```dockerfile
FROM nginx:alpine
```

## 为什么用 alpine 版本？
- `nginx:latest` ≈ 140MB
- `nginx:alpine` ≈ 45MB ← 更小、更快！

## 注意
- 优先用 `alpine` 版本
- 每个 RUN 产生一个新层，用 `&&` 合并命令减少层数
EOF

cat > notes-test.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>Markdown 渲染测试</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <style>
        .md-container {
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
        }
        .md-container h1 { color: #00d4ff; }
        .md-container code { background: #1a1a2e; padding: 2px 6px; border-radius: 3px; }
        .md-container pre { background: #1a1a2e; padding: 15px; border-radius: 6px; overflow-x: auto; }
        .md-container pre code { background: none; padding: 0; }
    </style>
</head>
<body>
    <div id="content" class="md-container">Loading...</div>
    <script>
        fetch('/notes/test.md')
            .then(res => res.text())
            .then(md => {
                document.getElementById('content').innerHTML = marked.parse(md);
            });
    </script>
</body>
</html>
HTMLEOF
```

用 Python HTTP 服务测试：

```bash
cd ~/Desktop/网站代码/z71.z71.pw
python -m http.server 8000
# 打开 http://localhost:8000/notes-test.html
```

能看到格式化的 Markdown 内容就说明 marked.js 方案可行。

---

## 产出物总结

| 产出 | 文件名 | 说明 |
|------|--------|------|
| AI 能力页面 | `ai.html` | 用 fetch 加载 ai.json，动态渲染 |
| AI 数据文件 | `assets/data/ai.json` | 包含工具链、技能、项目、架构等 |
| 导航栏更新 | `index.html` `tech.html` `sales.html` `contact.html` | 全部加上"AI 能力"入口 |
| 首页 AI 标签 | `index.html` | typewriter 加入 AI 相关词 |
| Python 虚拟环境 | `~/python-projects/venv/` | 已安装 fastapi/openai/requests 等 |
| 测试脚本 | `~/python-projects/test_env.py` | 验证环境就绪 |
| 依赖列表 | `~/python-projects/requirements.txt` | pip freeze 生成 |
| Markdown 渲染测试 | `notes-test.html` `notes/test.md` | marked.js 方案验证（可选） |

---

## 完成检查清单

- [ ] `ai.html` 在本地浏览器能正常打开，所有数据正确加载
- [ ] 导航栏在4个页面中都有"AI 能力"入口
- [ ] 首页 typewriter 加入了 AI 关键词
- [ ] GitHub 仓库已推送 `ai.html` 和 `ai.json`
- [ ] 服务器上 `http://8.138.195.245/ai.html` 可以访问
- [ ] Python 虚拟环境搭建完成，`test_env.py` 5个 ✅
- [ ] (选做) marked.js Demo 能正常渲染 .md 文件

---

## 下一步预览（第2周）

```
周一～周三：Ollama 深度部署 + Open WebUI + RAG
周四～周五：网站笔记板块 + Mermaid 架构图
周六～周日：上传所有技术笔记到网站
```

> 核心原则不变：**把你"做过但没展示"的东西全部变成网页上可看、可点、可截图的内容。**
