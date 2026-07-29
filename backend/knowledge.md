# 郑敬耀 (ZJY) 个人知识库

## 基本信息
- 姓名：郑敬耀
- 英文名：ZJY
- 年龄：21岁
- 电话：19129277718
- 邮箱：w19129277718@163.com
- 地址：广东省广州市海珠区工业大道南425号
- GitHub：https://github.com/z71271
- 个人网站：z71.z71.pw

## 个人定位
网络工程师 / IT技术销售 / Linux运维 / Web前端开发 / AI应用开发 / 本地AI部署 / 工具链搭建者

## 教育背景

### 广州南洋理工学院（继续教育学院）
- 专业：计算机网络技术
- 学历：大专
- 说明：深造计算机网络技术，系统学习网络规划与系统集成理论，旨在强化IT技术栈的专业性与前沿性

### 广州市公用事业技师学院（2022-09 至 2026-07）
- 专业：计算机网络应用
- 学历：专科（中专起点）
- 核心优势课程：中型网络管理与维护、信创操作系统配置、网络设备调试、服务器运维、Web前端开发
- 课程成绩：90分以上占比90%，两门核心专业课满分（《中型网络管理与维护》《信创操作系统配置与管理》）
- 专业综合排名：前5%
- 熟练使用华为eNSP配置静态路由、RIP、OSPF、默认路由、ISIS等协议

## 专业技能

### 路由交换（熟练度 90%）
华为eNSP静态路由、RIP、OSPF、BGP、VLAN、IP子网规划与掩码计算、Trunk配置

### 网络搭建（熟练度 85%）
中小型网络搭建、硬件组装维护与故障排查

### Linux运维（熟练度 80%）
CentOS/Ubuntu系统管理、Nginx/Apache + MySQL部署管理、SSH远程管理、SSL证书部署（acme.sh）、systemd服务管理、日志查看与分析

### Web前端（熟练度 75%）
HTML5/CSS3响应式页面开发、暗色主题设计、CSS变量统一配色、marked.js Markdown解析、移动端适配

### AI 本地部署（熟练度 70%）
Ollama模型管理（qwen2.5:7b、llama3.1:8b、deepseek-r1:8b）、Open WebUI部署、OpenAI兼容API配置、模型选型与显存管理

### Docker 容器化（熟练度 70%）
Dockerfile编写（nginx:alpine基础镜像，35MB）、docker-compose编排、镜像优化、踩过并解决3个生产级问题：Docker Hub国内不可达（配镜像源）、docker-compose vs docker compose兼容性、containerd shim版本冲突

### Python 后端（熟练度 50%）
FastAPI框架、OpenAI SDK调用、流式输出/SSE、多模型切换封装、REST API开发

### 其他技能
- RAG知识库搭建：AnythingLLM部署、LanceDB向量数据库、文档切块/嵌入/检索全流程
- ComfyUI / Stable Diffusion：文生图和图生图工作流、SD底层六大节点工作原理
- 网络设备批量配置：Python + paramiko批量SSH登录、CSV驱动、模拟设备零硬件依赖
- 爬虫：requests + BeautifulSoup、JSON/CSV输出、数据分析和技能标签词频统计

## 项目经历

### 1. 企业网络拓扑设计与实现（2026-08）
- 角色：独立设计 & 实施
- 描述：基于华为 eNSP 设计并实现中型企业三层网络架构
- 技术栈：eNSP、OSPF、BGP、VLAN、ACL、NAT
- 亮点：
  - OSPF Area 0 骨干区域设计，全网路由收敛 <5 秒
  - BGP 双 ISP 接入（AS 65000↔65001/65002），主备自动切换
  - 4 个 VLAN 规划（办公/访客/管理/服务器）
  - ACL + NAT 策略，访客网与服务器区完全隔离
  - 8 台设备完整配置，全部验证通过
  - 完整配置文档 + 验证截图（路由表/邻居状态/ping 测试）
- 仓库：https://github.com/z71271/enterprise-network-lab

### 2. 本地 AI API 网关
- 角色：独立开发
- 描述：用 FastAPI 封装 Ollama 本地大模型，提供统一的 API 网关
- 技术栈：Python、FastAPI、Ollama、SSE、Pydantic、systemd
- 亮点：
  - 支持多模型一键切换（qwen2.5 / llama3.1 / deepseek-r1）
  - SSE 流式输出（模拟 ChatGPT 打字效果）
  - Pydantic 数据验证
  - 配置了 systemd 服务文件，支持开机自启和崩溃自动重启
- 仓库：https://github.com/z71271/ai-gateway

### 3. Ollama 多模型本地部署
- 描述：在 RTX 3080（10GB VRAM）上部署了三个主流开源模型
- 硬件：i5-14600KF / 32GB DDR5 / RTX 3080 10GB
- 模型：qwen2.5:7b（中文）、llama3.1:8b（英文/通用）、deepseek-r1:8b（推理）
- 配套：部署 Open WebUI 提供类 ChatGPT 界面，配置 API 局域网访问，手机/平板均可使用本地AI服务

### 4. 网站容器化部署
- 描述：用 Dockerfile + docker-compose 将个人网站打包成 Nginx Alpine 镜像
- 技术栈：Docker、Nginx、docker-compose
- 亮点：
  - nginx:alpine 基础镜像，体积从140MB压缩至约35MB
  - 自定义 Nginx 配置（Gzip压缩、缓存策略、404页面）
  - .dockerignore 减小镜像体积
  - 一键 docker-compose up -d 完成部署
  - 部署至阿里云 2C2G 服务器
- 仓库：https://github.com/z71271/z71271

### 5. RAG 知识库搭建
- 描述：使用 AnythingLLM 桌面版搭建本地 RAG 知识库，连接本地 Ollama 模型
- 技术栈：AnythingLLM、RAG、Ollama、LanceDB
- 亮点：
  - 选型对比：Dify（资源重）、MaxKB（社区小）、FastGPT（部署复杂）→ 最终选AnythingLLM桌面版
  - 10分钟完成部署：下载→安装→Ollama连接→qwen2.5:7b→内置Embedding→LanceDB→拖文档上传
  - 上传技术清单/Docker笔记/Ollama笔记/简历信息，5个测试问题全部准确回答，零幻觉
  - 可现场演示：拖入任意文档→AI即时基于该文档准确回答问题

### 6. Shell 脚本合集
- 描述：3个实用运维脚本
- 技术栈：Bash、Nginx、systemd、crontab、certbot
- 脚本列表：
  - 新服务器一键环境部署（Nginx/Docker/Python）
  - Nginx 日志分析（状态码/IP/流量分布/异常探测）
  - SSL 证书自动续期（certbot + crontab）
- 每脚本都包含日志和告警机制
- 仓库：https://github.com/z71271/shell-scripts

### 7. 网络设备批量配置脚本
- 描述：Python + paramiko 批量 SSH 登录网络设备执行命令
- 技术栈：Python、paramiko、SSH、CSV
- 亮点：
  - 支持 CSV 驱动（读取设备列表和命令列表）
  - 内置模拟设备（零硬件依赖），含5条模拟华为交换机命令的仿真器
  - 每台设备输出独立保存
- 仓库：https://github.com/z71271/net-auto-config

### 8. 简易爬虫合集
- 描述：两个爬虫项目
- 技术栈：Python、requests、BeautifulSoup、JSON、CSV
- 项目：
  - 阮一峰博客文章爬虫（requests+BeautifulSoup，输出JSON/CSV）
  - AI岗位招聘信息爬虫（含数据分析和技能标签词频统计）
- 仓库：https://github.com/z71271/simple-crawler

### 9. ComfyUI / Stable Diffusion 部署
- 描述：在 RTX 3080 上部署 ComfyUI + Stable Diffusion（DreamShaper 8）
- 成果：跑通文生图和图生图工作流，理解 SD 底层六大节点的工作原理
- 技术栈：ComfyUI、Stable Diffusion、CUDA

## 实习/工作经历

### 潮玩夹 — 门店店员
- 陈列与理货：负责商品陈列、库存盘点与整理，打造直观吸引人的展示场景
- 销售与推荐：主动迎客，根据顾客喜好推荐商品、讲解亮点，挖掘消费需求
- 日常运营反馈：维护门店秩序，记录并反馈客户偏好，持续优化服务细节

### 间客曼 VR — 前台游戏顾问
- 全程陪玩引导：全程贴身陪同游戏，即时解答并引导顾客解决游玩中的问题
- 精准套餐营销：根据顾客游玩时长与体验，精准推荐并销售合适的优惠套餐卡券

### 麦当劳餐厅 — 店员
- 前台接待与收银：负责顾客迎送、点单及收银结算，主动沟通并提升消费体验
- 后厨制作与维护：负责食材备料、餐品制作及环境卫生，保障门店标准化运营
- 高峰协同抗压：配合排班，协同团队高效应对客流高峰，具备极强的抗压能力

### 万达影城 — 前台服务
- 票务与咨询：负责线下售票，一对一讲解影片、场次及会员政策，精准匹配需求
- 客诉与维护：解答日常咨询，妥善处理观影疑问与简单客诉，维护良好客群关系
- 数据与台账：每日核对票务数据，规范整理前台台账

## 荣誉奖项
- 一等学业奖学金：连续5学期获得
- 三等学业奖学金：1学期
- 三好学生：连续6学期获评
- 专业排名：前5%
- 优秀学生干部：2次
- 学生会优秀学生干部：1次
- 计算机通讯网络运行管理员：认证

## 社团与组织经历

### 计算机服务社 | 社长
- 搭建12人技术服务团队，策划校园电脑维修、AI办公技能普及、网络设备科普线下推广活动
- 面向全校师生开展技术宣讲和AI工具使用宣讲（ChatGPT/DeepSeek/Ollama本地部署入门），累计服务上千师生
- 锻炼产品宣讲、客户接待、需求沟通能力
- 管理团队分工、活动复盘，协调解决现场各类问题

### 班级 | 班长
- 统筹班级日常管理，充当师生沟通核心纽带，协调推进班级各项事务
- 两次获评"优秀学生干部"

### 学生会 | 宣传部干事
- 负责校园活动统筹与宣传工作，包括方案策划、海报设计及拍摄记录
- 获评"学生会优秀学生干部"

### "银智课堂"志愿服务项目 | 负责人
- 独立主导公益技术科普项目，面向社会群众开展网络、电脑基础教学
- 面向不同年龄层群体通俗讲解数字设备、网络知识，将专业技术简化通俗表达
- 累计覆盖4000+人次
- 项目获《广州日报》媒体报道
- 全程对接合作单位、统筹场次、对接群众

## 销售能力（面向IT销售岗位）
- 客户沟通：擅长一对一客户洽谈、公众技术宣讲，可将复杂网络设备、服务器技术转化为客户易懂的价值讲解
- 需求挖掘：能快速识别客户组网、办公运维、硬件设备采购痛点，匹配对应产品解决方案
- 市场推广：具备线下活动策划、宣传引流、客户接待、售后答疑全流程实操经验
- 商务统筹：团队管理、活动统筹、多方对接、项目复盘，目标导向，抗压性强
- 办公工具：熟练Office全套，可独立制作产品PPT、客户方案、数据统计报表

## AI 工具链掌握
- Ollama：本地大语言模型运行环境，支持多模型并行部署
- Open WebUI：类ChatGPT交互界面，Docker部署
- DeepSeek API：通过API调用DeepSeek大模型
- AnythingLLM：本地RAG知识库平台
- ComfyUI：基于节点的Stable Diffusion工作流界面
- OpenClaw：AI工具集成平台，多工具协同调用

## 服务器环境
- 云服务商：阿里云 ECS
- 配置：2核CPU / 2GB内存
- 系统：Ubuntu
- Web服务器：Nginx（Docker容器化部署）
- 网站运行在 Docker 容器中

## 职业目标
- 网络工程师方向：致力于高效、安全的网络解决方案实践
- IT销售方向：立志深耕IT销售赛道，适配IT软硬件、网络设备技术销售岗位
- AI应用方向：具备从模型部署到API集成到知识库应用的全链条实操能力
