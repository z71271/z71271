# 郑敬耀 — 第4周 周四～周五｜Linux 进阶实操

> 目标：写 systemd 服务文件 + 3个实用 Shell 脚本 + 服务器监控 + Linux 命令速查表
> 预计时间：2天（每天3-4小时）
> 产出：ai-gateway.service + shell-scripts 仓库 + 监控面板 + linux-cheatsheet.html

---

## 周四（约4小时）｜ systemd 服务 + Shell 脚本合集

---

### 步骤1：为 AI 网关写 systemd 服务文件（1小时）

> systemd 是 Linux 上的服务管理器。写一个 `.service` 文件后，你的 AI 网关就能开机自启、崩溃自动重启。

#### 1.1 理解 systemd

```
systemd 三个概念：

service 文件 = 定义了"怎么启动你的程序"
systemctl 命令 = 操控服务（启动/停止/重启/查看状态）
journalctl 命令 = 查看服务日志

类比：
  service 文件  = exe 快捷方式的属性设置
  systemctl     = 任务管理器（启动/停止进程）
  journalctl    = 事件查看器（看日志）
```

#### 1.2 先在服务器上准备 AI 网关代码

SSH 到云服务器：

```bash
ssh root@8.138.195.245
```

克隆你的 ai-gateway 项目到服务器：

```bash
# 如果服务器能连 GitHub（试一下）
git clone https://github.com/z71271/ai-gateway.git /opt/ai-gateway

# 如果连不上，用 scp 从本地传：
# 本地 Git Bash:
# scp -r ~/python-projects/ai-gateway root@8.138.195.245:/opt/
```

安装依赖：

```bash
cd /opt/ai-gateway
apt install -y python3-pip
pip3 install fastapi uvicorn openai pydantic
```

**注意**：这个 API 网关依赖你本地 PC 的 Ollama。服务器无法直接连 `localhost:11434`。有两个方案：

- **方案 A**（演示用）：修改 `ollama_client.py` 让它能连到你本地 PC 的 Ollama（如果你有公网 IP 或用了内网穿透）
- **方案 B**（学习用）：把 Ollama URL 改成 DeepSeek API 或其他公开 API，这样服务器上就能独立运行
- **方案 C**（最简单）：`systemd` 文件本身的学习和写法是目标，能不能真正调 AI 是次要的——面试时 systemd 的写法才是考察点

选方案 C 就行——systemd 文件的写法是重点。

#### 1.3 创建 systemd 服务文件

```bash
# 在服务器上创建服务文件
sudo vim /etc/systemd/system/ai-gateway.service
```

文件内容：

```ini
[Unit]
Description=本地 AI API 网关服务
Documentation=https://github.com/z71271/ai-gateway
After=network.target
Wants=network.target

[Service]
# 运行用户（不要用 root 跑生产服务）
User=root
Group=root

# 工作目录
WorkingDirectory=/opt/ai-gateway

# 启动命令
ExecStart=/usr/bin/python3 -m uvicorn main:app --host 0.0.0.0 --port 18800

# 重启策略：总是自动重启
Restart=always
# 重启前等5秒
RestartSec=5

# 环境变量
Environment=PYTHONUNBUFFERED=1
Environment=OLLAMA_HOST=http://localhost:11434

# 标准输出/错误输出到 journald
StandardOutput=journal
StandardError=journal

# 日志标识
SyslogIdentifier=ai-gateway

[Install]
# 开机自启
WantedBy=multi-user.target
```

#### 1.4 systemctl 命令实操

```bash
# 重新加载 systemd 配置（每次修改 .service 文件后都要执行）
systemctl daemon-reload

# 启动服务
systemctl start ai-gateway

# 查看状态
systemctl status ai-gateway
# 看到 active (running) 就说明启动成功

# 设置开机自启
systemctl enable ai-gateway

# 查看日志（实时）
journalctl -u ai-gateway -f

# 重启服务
systemctl restart ai-gateway

# 停止服务
systemctl stop ai-gateway

# 查看服务是否开机自启
systemctl is-enabled ai-gateway

# 列出所有服务
systemctl list-units --type=service
```

验证：

```bash
# 启动后测试 API
curl http://localhost:18800/health
# 应该返回 JSON（即使 Ollama 连不上，也能看到返回值）
```

#### 1.5 保存 service 文件到 GitHub

把 `ai-gateway.service` 文件复制到你的 ai-gateway 项目里：

```bash
# 服务器上
cp /etc/systemd/system/ai-gateway.service /opt/ai-gateway/

# 本地 PC（把文件也加入 GitHub）
cd ~/python-projects/ai-gateway
# 把 service 文件内容写入
cat > ai-gateway.service << 'EOF'
[Unit]
Description=本地 AI API 网关服务
Documentation=https://github.com/z71271/ai-gateway
After=network.target

[Service]
User=root
WorkingDirectory=/opt/ai-gateway
ExecStart=/usr/bin/python3 -m uvicorn main:app --host 0.0.0.0 --port 18800
Restart=always
RestartSec=5
Environment=PYTHONUNBUFFERED=1
StandardOutput=journal
StandardError=journal
SyslogIdentifier=ai-gateway

[Install]
WantedBy=multi-user.target
EOF

git add ai-gateway.service
git commit -m "添加 systemd 服务文件，支持开机自启和自动重启"
git push origin main
```

截图：
- `systemctl status ai-gateway` 显示 active (running)
- `journalctl -u ai-gateway -n 20` 显示最近的日志

---

### 步骤2：写 Shell 脚本合集（2.5小时）

> 3个实用脚本，每个都能放进简历。

在服务器上创建脚本目录：

```bash
ssh root@8.138.195.245
mkdir -p ~/shell-scripts
cd ~/shell-scripts
```

#### 2.1 脚本1：服务器一键环境部署脚本

```bash
cat > server-setup.sh << 'EOF'
#!/bin/bash
#===========================================
# 服务器一键环境部署脚本
# 用途：新服务器到手，跑这一个脚本搞定基础环境
# 适用：Ubuntu 20.04+/Debian 11+
#===========================================

set -e  # 任何一条命令失败就退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info()  { echo -e "${GREEN}[✓]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
log_error() { echo -e "${RED}[✗]${NC} $1"; }
log_step()  { echo -e "\n${YELLOW}>>> $1${NC}"; }

# 检查 root 权限
if [[ $EUID -ne 0 ]]; then
    log_error "请用 root 权限运行: sudo bash server-setup.sh"
    exit 1
fi

echo "========================================"
echo "  服务器一键环境部署脚本"
echo "  时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================"

# ===== 1. 系统更新 =====
log_step "步骤 1/6: 更新系统包"
apt update -y && apt upgrade -y
log_info "系统包更新完成"

# ===== 2. 安装基础工具 =====
log_step "步骤 2/6: 安装基础工具"
apt install -y \
    curl wget git vim \
    htop net-tools dnsutils \
    unzip zip \
    build-essential
log_info "基础工具安装完成"

# ===== 3. 安装 Nginx =====
log_step "步骤 3/6: 安装 Nginx"
if command -v nginx &>/dev/null; then
    log_warn "Nginx 已安装，跳过"
else
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
    log_info "Nginx 安装完成"
fi

# ===== 4. 安装 Docker =====
log_step "步骤 4/6: 安装 Docker"
if command -v docker &>/dev/null; then
    log_warn "Docker 已安装，跳过"
else
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    log_info "Docker 安装完成"
fi

# ===== 5. 安装 Python3 + pip =====
log_step "步骤 5/6: 安装 Python3"
apt install -y python3 python3-pip python3-venv
log_info "Python3 安装完成: $(python3 --version)"

# ===== 6. 基础安全配置 =====
log_step "步骤 6/6: 基础安全配置"

# 防火墙
if command -v ufw &>/dev/null; then
    ufw allow 22/tcp    # SSH
    ufw allow 80/tcp    # HTTP
    ufw allow 443/tcp   # HTTPS
    ufw --force enable
    log_info "UFW 防火墙已配置（22/80/443）"
fi

# Fail2ban
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
log_info "Fail2ban 已安装并启动"

# ===== 总结 =====
echo ""
echo "========================================"
echo "  部署完成！"
echo "========================================"
echo "已安装:"
echo "  - 基础工具: curl wget git vim htop"
echo "  - Nginx:     $(nginx -v 2>&1)"
echo "  - Docker:    $(docker --version)"
echo "  - Python:    $(python3 --version)"
echo "  - UFW:       $(ufw status | head -1)"
echo "  - Fail2ban:  $(fail2ban-client --version 2>&1 | head -1)"
echo ""
echo "建议下一步:"
echo "  1. 配置 SSH 密钥登录（禁止密码登录）"
echo "  2. 安装 Docker Compose V2"
echo "  3. 部署你的应用"
EOF

chmod +x server-setup.sh
```

#### 2.2 脚本2：Nginx 日志分析脚本

```bash
cat > nginx-log-analyzer.sh << 'EOF'
#!/bin/bash
#===========================================
# Nginx 日志分析脚本
# 用途：快速分析 Nginx 访问日志，输出关键指标
# 用法：bash nginx-log-analyzer.sh [日志文件路径]
#===========================================

LOG_FILE="${1:-/var/log/nginx/access.log}"

if [[ ! -f "$LOG_FILE" ]]; then
    echo "错误: 日志文件 $LOG_FILE 不存在"
    echo "用法: bash $0 /path/to/access.log"
    exit 1
fi

echo "========================================"
echo "  Nginx 日志分析报告"
echo "  文件: $LOG_FILE"
echo "  时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================"

# 1. 总请求数
total=$(wc -l < "$LOG_FILE")
echo -e "\n📊 总请求数: $total"

# 2. 状态码分布
echo -e "\n📋 状态码分布:"
awk '{print $9}' "$LOG_FILE" | sort | uniq -c | sort -rn | while read count code; do
    # 状态码着色
    if [[ $code -ge 500 ]]; then
        icon="🔴"
    elif [[ $code -ge 400 ]]; then
        icon="🟡"
    elif [[ $code -ge 300 ]]; then
        icon="🔵"
    else
        icon="🟢"
    fi
    percent=$(awk "BEGIN {printf \"%.1f\", ($count/$total)*100}")
    echo "  $icon $code: $count 次 ($percent%)"
done

# 3. Top 10 访问最多的页面
echo -e "\n📄 访问最多的页面 (Top 10):"
awk '{print $7}' "$LOG_FILE" | sort | uniq -c | sort -rn | head -10 | \
    awk '{printf "  %4d 次  %s\n", $1, $2}'

# 4. Top 10 来源 IP
echo -e "\n🌐 访问最多的 IP (Top 10):"
awk '{print $1}' "$LOG_FILE" | sort | uniq -c | sort -rn | head -10 | \
    awk '{printf "  %4d 次  %s\n", $1, $2}'

# 5. 流量统计（字节）
echo -e "\n💾 流量统计:"
bytes=$(awk '{sum+=$10} END {print sum}' "$LOG_FILE")
if [[ $bytes -gt 1073741824 ]]; then
    gb=$(awk "BEGIN {printf \"%.2f\", $bytes/1073741824}")
    echo "  总流量: ${gb} GB"
elif [[ $bytes -gt 1048576 ]]; then
    mb=$(awk "BEGIN {printf \"%.2f\", $bytes/1048576}")
    echo "  总流量: ${mb} MB"
else
    kb=$(awk "BEGIN {printf \"%.2f\", $bytes/1024}")
    echo "  总流量: ${kb} KB"
fi

# 6. 按小时统计请求分布
echo -e "\n🕐 请求时间分布（小时）:"
awk '{split($4, a, ":"); hour=a[2]} {count[hour]++} END {for (h in count) printf "  %02d:00 - %d 次\n", h, count[h]}' "$LOG_FILE" | sort

# 7. 异常请求（4xx + 5xx）
echo -e "\n⚠️  异常请求样例（最近10条 4xx/5xx）:"
awk '$9 ~ /^[45]/ {print $0}' "$LOG_FILE" | tail -10 | \
    awk '{print "  [" $4 "] " $1 " → " $7 " (" $9 ")"}'

# 8. 独立访客数
echo -e "\n👤 独立 IP 数:"
awk '{print $1}' "$LOG_FILE" | sort -u | wc -l

echo -e "\n========================================"
echo "  分析完成"
echo "========================================"
EOF

chmod +x nginx-log-analyzer.sh
```

#### 2.3 脚本3：SSL 证书自动续期脚本

```bash
cat > ssl-renewal.sh << 'EOF'
#!/bin/bash
#===========================================
# SSL 证书自动续期脚本
# 用途：配合 certbot 自动续期 Let's Encrypt 证书
# 建议：加入 crontab，每天凌晨3点执行
#       crontab -e
#       0 3 * * * /root/shell-scripts/ssl-renewal.sh >> /var/log/ssl-renewal.log 2>&1
#===========================================

LOG_FILE="/var/log/ssl-renewal.log"
DOMAINS=("8.138.195.245")  # 替换为你的域名（或先用 IP 占位）

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 检查 certbot 是否安装
if ! command -v certbot &>/dev/null; then
    log "错误: certbot 未安装"
    log "安装命令: apt install -y certbot python3-certbot-nginx"
    exit 1
fi

log "======== SSL 证书续期检查 ========"

# 检查证书到期时间
for domain in "${DOMAINS[@]}"; do
    # 检查证书文件是否存在
    CERT_FILE="/etc/letsencrypt/live/$domain/fullchain.pem"
    
    if [[ -f "$CERT_FILE" ]]; then
        expiry=$(openssl x509 -enddate -noout -in "$CERT_FILE" | cut -d= -f2)
        expiry_epoch=$(date -d "$expiry" +%s)
        now_epoch=$(date +%s)
        days_left=$(( ($expiry_epoch - $now_epoch) / 86400 ))
        
        log "域名: $domain"
        log "  证书到期: $expiry"
        log "  剩余天数: $days_left 天"
        
        if [[ $days_left -lt 30 ]]; then
            log "  ⚠️ 证书将在30天内到期，尝试续期..."
            certbot renew --nginx --quiet
            if [[ $? -eq 0 ]]; then
                log "  ✅ 证书续期成功"
                # 重载 Nginx
                systemctl reload nginx
                log "  Nginx 已重载"
            else
                log "  ❌ 证书续期失败！请手动处理"
            fi
        else
            log "  ✅ 证书有效期充足，无需续期"
        fi
    else
        log "域名: $domain - 未找到 SSL 证书文件"
        log "  如需申请证书: certbot --nginx -d $domain"
    fi
    echo ""
done

log "======== 检查完成 ========"
EOF

chmod +x ssl-renewal.sh
```

#### 2.4 创建 README 和推送到 GitHub

```bash
cd ~/shell-scripts

cat > README.md << 'EOF'
# Shell 脚本合集

> 实用 Linux Shell 脚本，覆盖运维日常工作。

## 脚本列表

| 脚本 | 用途 | 用法 |
|------|------|------|
| `server-setup.sh` | 新服务器一键部署（Nginx/Docker/Python/安全） | `sudo bash server-setup.sh` |
| `nginx-log-analyzer.sh` | Nginx 访问日志分析（状态码/IP/流量/异常） | `bash nginx-log-analyzer.sh [日志路径]` |
| `ssl-renewal.sh` | SSL 证书自动续期（配合 certbot+crontab） | `bash ssl-renewal.sh` |

## 技术栈

- Bash Shell
- Nginx 日志格式解析
- certbot / Let's Encrypt
- systemd / crontab

## 部署建议

```bash
# 下载脚本
git clone https://github.com/z71271/shell-scripts.git

# 定时执行 SSL 续期
crontab -e
# 添加: 0 3 * * * /root/shell-scripts/ssl-renewal.sh >> /var/log/ssl-renewal.log 2>&1
```
EOF

git init
git add .
git commit -m "Shell脚本合集：服务器部署/日志分析/SSL续期"
git remote add origin https://github.com/z71271/shell-scripts.git
git branch -M main
git push -u origin main
```

---

## 周五（约3.5小时）｜ 监控 + 速查表 + 安全基础

---

### 步骤3：服务器性能监控（1.5小时）

#### 3.1 方案：轻量自定义监控脚本 + Cron

> netdata 吃内存，你的服务器 2C2G 跑它不划算。用自定义脚本 + Cron 更实际。

```bash
ssh root@8.138.195.245
mkdir ~/monitor
cd ~/monitor
```

```bash
cat > monitor.sh << 'EOF'
#!/bin/bash
#===========================================
# 服务器轻量监控脚本
# 建议：每5分钟执行一次
# crontab -e
# */5 * * * * /root/monitor/monitor.sh
#===========================================

OUTPUT_DIR="/var/log/server-monitor"
mkdir -p "$OUTPUT_DIR"

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
SNAPSHOT_FILE="$OUTPUT_DIR/snapshot_$(date '+%Y%m%d').log"

# === CPU 使用率 ===
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)

# === 内存 ===
MEM_TOTAL=$(free -m | awk 'NR==2{print $2}')
MEM_USED=$(free -m | awk 'NR==2{print $3}')
MEM_PERCENT=$(awk "BEGIN {printf \"%.1f\", ($MEM_USED/$MEM_TOTAL)*100}")

# === 磁盘 ===
DISK_USAGE=$(df -h / | awk 'NR==2{print $5}' | tr -d '%')
DISK_AVAIL=$(df -h / | awk 'NR==2{print $4}')

# === 网络流量 ===
RX_BYTES=$(cat /sys/class/net/eth0/statistics/rx_bytes 2>/dev/null || echo 0)
TX_BYTES=$(cat /sys/class/net/eth0/statistics/tx_bytes 2>/dev/null || echo 0)

# === 进程数 ===
PROC_COUNT=$(ps aux | wc -l)
LOAD_AVG=$(uptime | awk -F'load average:' '{print $2}' | tr -d ' ')

# === 连接数 ===
TCP_CONNS=$(ss -t state established | wc -l)

# === Docker 容器状态 ===
DOCKER_RUNNING=$(docker ps -q 2>/dev/null | wc -l)
DOCKER_TOTAL=$(docker ps -a -q 2>/dev/null | wc -l)

# === Nginx 状态 ===
NGINX_STATUS=$(systemctl is-active nginx 2>/dev/null || echo "not-installed")

# === 输出到日志文件 ===
{
    echo "======== $TIMESTAMP ========"
    echo "CPU:      ${CPU_USAGE}%"
    echo "内存:     ${MEM_USED}MB / ${MEM_TOTAL}MB (${MEM_PERCENT}%)"
    echo "磁盘:     ${DISK_USAGE}% (可用 ${DISK_AVAIL})"
    echo "负载:     ${LOAD_AVG}"
    echo "进程数:   ${PROC_COUNT}"
    echo "TCP连接:  ${TCP_CONNS}"
    echo "Docker:   ${DOCKER_RUNNING} 运行中 / ${DOCKER_TOTAL} 总计"
    echo "Nginx:    ${NGINX_STATUS}"
    echo "网卡 RX:  ${RX_BYTES} bytes"
    echo "网卡 TX:  ${TX_BYTES} bytes"
} >> "$SNAPSHOT_FILE"

# === 告警 ===
if (( $(echo "$CPU_USAGE > 90" | bc -l 2>/dev/null || echo 0) )); then
    echo "[ALERT] CPU 使用率过高: ${CPU_USAGE}%" >> "$SNAPSHOT_FILE"
fi

if (( $(echo "$MEM_PERCENT > 90" | bc -l 2>/dev/null || echo 0) )); then
    echo "[ALERT] 内存使用率过高: ${MEM_PERCENT}%" >> "$SNAPSHOT_FILE"
fi

if [[ $DISK_USAGE -gt 90 ]]; then
    echo "[ALERT] 磁盘使用率过高: ${DISK_USAGE}%" >> "$SNAPSHOT_FILE"
fi

# === 清理7天前的快照 ===
find "$OUTPUT_DIR" -name "snapshot_*.log" -mtime +7 -delete 2>/dev/null
EOF

chmod +x monitor.sh
```

#### 3.2 设置定时任务

```bash
# 编辑 crontab
crontab -e

# 添加以下行（每5分钟执行一次监控）
*/5 * * * * /root/monitor/monitor.sh

# 查看效果（手动跑一次）
bash /root/monitor/monitor.sh
cat /var/log/server-monitor/snapshot_$(date '+%Y%m%d').log
```

#### 3.3 创建监控数据查看脚本

```bash
cat > view-stats.sh << 'EOF'
#!/bin/bash
echo "========================================"
echo "  服务器实时状态"
echo "  时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================"

echo -e "\n🖥️  CPU:"
top -bn1 | grep "Cpu(s)" | sed 's/^/  /'

echo -e "\n🧠 内存:"
free -h | sed 's/^/  /'

echo -e "\n💾 磁盘:"
df -h / | sed 's/^/  /'

echo -e "\n🌐 网络连接数:"
echo "  TCP 连接: $(ss -t state established | wc -l)"

echo -e "\n🐳 Docker 容器:"
docker ps --format "  {{.Names}}: {{.Status}}" 2>/dev/null || echo "  Docker 未运行"

echo -e "\n📋 最近日志（最后10行）:"
tail -10 /var/log/server-monitor/snapshot_$(date '+%Y%m%d').log 2>/dev/null | sed 's/^/  /'

echo -e "\n========================================"
EOF

chmod +x view-stats.sh
```

截图：
- `bash view-stats.sh` 输出
- `/var/log/server-monitor/` 下的快照文件

---

### 步骤4：写 Linux 命令速查表网页（1.5小时）

> 在网站上新增一个页面——把你实际用过的 Linux 命令整理出来。

```bash
cd ~/Desktop/网站代码/z71.z71.pw
```

```html
cat > linux-cheatsheet.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Linux 命令速查 | ZJY</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        .cheatsheet-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .cheatsheet-header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 25px;
            border-bottom: 1px solid rgba(0, 212, 255, 0.2);
        }

        .cheatsheet-header h1 {
            font-size: 2em;
            color: #00d4ff;
            margin-bottom: 8px;
        }

        .cheatsheet-header .subtitle {
            color: #888;
            font-size: 0.85em;
        }

        .category {
            margin-bottom: 35px;
            padding: 0 5px;
        }

        .category h2 {
            color: #00d4ff;
            font-size: 1.2em;
            margin-bottom: 15px;
            padding-left: 10px;
            border-left: 3px solid #00d4ff;
        }

        .cmd-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.85em;
        }

        .cmd-table th {
            background: rgba(0, 212, 255, 0.08);
            color: #00d4ff;
            padding: 10px 12px;
            text-align: left;
            font-weight: 600;
            border-bottom: 1px solid rgba(0, 212, 255, 0.15);
        }

        .cmd-table td {
            padding: 8px 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            color: #bbb;
        }

        .cmd-table code {
            background: #1a1a2e;
            padding: 2px 6px;
            border-radius: 3px;
            color: #ffc800;
            font-size: 0.9em;
            white-space: nowrap;
        }

        .cmd-table tr:hover td {
            background: rgba(0, 212, 255, 0.02);
        }

        .tip-box {
            padding: 12px 18px;
            border-left: 3px solid #ffc800;
            background: rgba(255, 200, 0, 0.05);
            margin-top: 20px;
            border-radius: 0 6px 6px 0;
            color: #aaa;
            font-size: 0.85em;
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-logo">&lt;ZJY/&gt;</a>
            <ul class="nav-links">
                <li><a href="/">首页</a></li>
                <li><a href="/tech.html">技术简历</a></li>
                <li><a href="/ai.html">AI 能力</a></li>
                <li><a href="/sales.html">销售简历</a></li>
                <li><a href="/notes.html">笔记</a></li>
                <li><a href="/linux-cheatsheet.html" class="active">速查</a></li>
                <li><a href="/contact.html">联系</a></li>
            </ul>
        </div>
    </nav>

    <div class="cheatsheet-container">
        <div class="cheatsheet-header">
            <h1>Linux 命令速查表</h1>
            <p class="subtitle">基于实际使用经验整理 — 持续更新</p>
        </div>

        <!-- 1. 文件与目录 -->
        <div class="category">
            <h2>📁 文件与目录</h2>
            <table class="cmd-table">
                <tr><th>命令</th><th>说明</th></tr>
                <tr><td><code>ls -la</code></td><td>列出所有文件（含隐藏文件）+ 详细信息</td></tr>
                <tr><td><code>cd /path</code></td><td>切换目录</td></tr>
                <tr><td><code>pwd</code></td><td>显示当前目录路径</td></tr>
                <tr><td><code>mkdir -p a/b/c</code></td><td>递归创建目录</td></tr>
                <tr><td><code>cp -r src dest</code></td><td>递归复制目录</td></tr>
                <tr><td><code>mv old new</code></td><td>移动/重命名文件</td></tr>
                <tr><td><code>rm -rf dir</code></td><td>强制删除目录（慎用！）</td></tr>
                <tr><td><code>find . -name "*.log"</code></td><td>查找 .log 文件</td></tr>
                <tr><td><code>du -sh *</code></td><td>显示每个文件/目录大小</td></tr>
                <tr><td><code>df -h</code></td><td>查看磁盘使用情况</td></tr>
                <tr><td><code>cat file</code></td><td>查看文件内容</td></tr>
                <tr><td><code>tail -f file</code></td><td>实时追踪文件末尾（看日志用）</td></tr>
                <tr><td><code>head -20 file</code></td><td>查看文件前20行</td></tr>
                <tr><td><code>chmod +x script.sh</code></td><td>给脚本添加执行权限</td></tr>
                <tr><td><code>chown user:group file</code></td><td>修改文件所属用户/组</td></tr>
            </table>
        </div>

        <!-- 2. 进程管理 -->
        <div class="category">
            <h2>⚙️ 进程管理</h2>
            <table class="cmd-table">
                <tr><th>命令</th><th>说明</th></tr>
                <tr><td><code>ps aux</code></td><td>查看所有进程</td></tr>
                <tr><td><code>ps aux | grep nginx</code></td><td>查找 nginx 相关进程</td></tr>
                <tr><td><code>top</code></td><td>实时进程监控（按 q 退出）</td></tr>
                <tr><td><code>htop</code></td><td>top 的增强版（彩色界面）</td></tr>
                <tr><td><code>kill -9 PID</code></td><td>强制结束进程</td></tr>
                <tr><td><code>killall nginx</code></td><td>按名称结束进程</td></tr>
                <tr><td><code>bg / fg</code></td><td>后台/前台切换任务</td></tr>
                <tr><td><code>nohup cmd &</code></td><td>后台运行，关终端不中断</td></tr>
                <tr><td><code>jobs</code></td><td>查看后台任务</td></tr>
            </table>
        </div>

        <!-- 3. 网络 -->
        <div class="category">
            <h2>🌐 网络</h2>
            <table class="cmd-table">
                <tr><th>命令</th><th>说明</th></tr>
                <tr><td><code>ip addr</code></td><td>查看网络接口和IP</td></tr>
                <tr><td><code>ss -tlnp</code></td><td>查看所有监听端口</td></tr>
                <tr><td><code>ss -t state established</code></td><td>查看已建立的 TCP 连接</td></tr>
                <tr><td><code>netstat -tlnp</code></td><td>查看监听端口（传统命令）</td></tr>
                <tr><td><code>curl -I https://baidu.com</code></td><td>查看 HTTP 响应头</td></tr>
                <tr><td><code>curl -X POST url -d '{}'</code></td><td>发送 POST 请求</td></tr>
                <tr><td><code>ping -c 4 8.8.8.8</code></td><td>ping 4次测试连通性</td></tr>
                <tr><td><code>traceroute 8.8.8.8</code></td><td>路由追踪</td></tr>
                <tr><td><code>iptables -L -n</code></td><td>查看防火墙规则</td></tr>
            </table>
        </div>

        <!-- 4. 系统服务 -->
        <div class="category">
            <h2>🔧 系统服务 (systemd)</h2>
            <table class="cmd-table">
                <tr><th>命令</th><th>说明</th></tr>
                <tr><td><code>systemctl status nginx</code></td><td>查看服务状态</td></tr>
                <tr><td><code>systemctl start/stop nginx</code></td><td>启动/停止服务</td></tr>
                <tr><td><code>systemctl restart nginx</code></td><td>重启服务</td></tr>
                <tr><td><code>systemctl enable nginx</code></td><td>设置开机自启</td></tr>
                <tr><td><code>systemctl disable nginx</code></td><td>取消开机自启</td></tr>
                <tr><td><code>systemctl daemon-reload</code></td><td>重载服务配置（改 .service 后执行）</td></tr>
                <tr><td><code>journalctl -u nginx -f</code></td><td>实时查看服务日志</td></tr>
                <tr><td><code>journalctl -u nginx --since today</code></td><td>查看今天的服务日志</td></tr>
            </table>
        </div>

        <!-- 5. 包管理 -->
        <div class="category">
            <h2>📦 包管理（apt / Ubuntu）</h2>
            <table class="cmd-table">
                <tr><th>命令</th><th>说明</th></tr>
                <tr><td><code>apt update</code></td><td>更新软件源索引</td></tr>
                <tr><td><code>apt upgrade -y</code></td><td>升级所有可升级的包</td></tr>
                <tr><td><code>apt install pkg</code></td><td>安装软件包</td></tr>
                <tr><td><code>apt remove pkg</code></td><td>卸载软件包</td></tr>
                <tr><td><code>apt purge pkg</code></td><td>彻底卸载（含配置文件）</td></tr>
                <tr><td><code>apt search keyword</code></td><td>搜索软件包</td></tr>
                <tr><td><code>apt list --installed</code></td><td>列出已安装的包</td></tr>
                <tr><td><code>dpkg -l | grep nginx</code></td><td>查看已装包的详细信息</td></tr>
            </table>
        </div>

        <!-- 6. 权限与用户 -->
        <div class="category">
            <h2>🔐 权限与用户</h2>
            <table class="cmd-table">
                <tr><th>命令</th><th>说明</th></tr>
                <tr><td><code>sudo cmd</code></td><td>以 root 身份执行命令</td></tr>
                <tr><td><code>whoami</code></td><td>查看当前用户</td></tr>
                <tr><td><code>id</code></td><td>查看当前用户 UID/GID</td></tr>
                <tr><td><code>useradd -m username</code></td><td>创建用户（含 home 目录）</td></tr>
                <tr><td><code>passwd username</code></td><td>设置/修改用户密码</td></tr>
                <tr><td><code>usermod -aG group user</code></td><td>将用户加入组（如 docker 组）</td></tr>
                <tr><td><code>su - username</code></td><td>切换用户</td></tr>
                <tr><td><code>chmod 755 file</code></td><td>设置权限 rwxr-xr-x</td></tr>
                <tr><td><code>chmod 600 private.key</code></td><td>仅 owner 可读写</td></tr>
            </table>
        </div>

        <!-- 7. 文本处理 -->
        <div class="category">
            <h2>📝 文本处理</h2>
            <table class="cmd-table">
                <tr><th>命令</th><th>说明</th></tr>
                <tr><td><code>grep "error" file</code></td><td>搜索包含 error 的行</td></tr>
                <tr><td><code>grep -r "TODO" .</code></td><td>递归搜索当前目录</td></tr>
                <tr><td><code>grep -v "debug" file</code></td><td>排除包含 debug 的行</td></tr>
                <tr><td><code>awk '{print $1}' file</code></td><td>打印第1列</td></tr>
                <tr><td><code>sed 's/old/new/g' file</code></td><td>替换文本</td></tr>
                <tr><td><code>wc -l file</code></td><td>统计行数</td></tr>
                <tr><td><code>sort | uniq -c | sort -rn</code></td><td>排序去重统计（经典组合）</td></tr>
                <tr><td><code>tee file</code></td><td>同时输出到屏幕和文件</td></tr>
            </table>
        </div>

        <div class="tip-box">
            💡 <strong>提示</strong>：这份速查表只收录了我在服务器运维中实际用过的命令。
            不会用的命令不写——宁缺毋滥，确保每一条都能在终端里敲出来。
        </div>
    </div>
</body>
</html>
HTMLEOF
```

---

### 步骤5：安全基础学习 + 服务器加固（30分钟）

> 这部分和第3份文件（周六～周日）有重叠，但今天先做一些基础的安全配置。

#### 5.1 配置 fail2ban

```bash
ssh root@8.138.195.245

# 确认 fail2ban 运行中
systemctl status fail2ban

# 查看当前 jail 配置
fail2ban-client status

# 查看 SSH jail 状态
fail2ban-client status sshd

# 手动解封某个 IP（如果误封了）
# fail2ban-client set sshd unbanip 1.2.3.4
```

#### 5.2 配置 UFW 防火墙

```bash
# 查看当前状态
ufw status verbose

# 如果没开启
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 9999/tcp   # Docker 网站端口（如果用了）
ufw enable

# 确认
ufw status
```

截图：
- `ufw status` 显示规则
- `fail2ban-client status sshd` 显示封禁统计

---

### 步骤6：推送到 GitHub + 更新网站（15分钟）

```bash
cd ~/Desktop/网站代码/z71.z71.pw
git add linux-cheatsheet.html
git commit -m "新增 Linux 命令速查表页面"
git push origin main
```

服务器同步：
```bash
ssh root@8.138.195.245
cd /www/wwwroot/z71.z71.pw
git pull origin main
```

---

## 周四～周五 产出物总结

| 产出 | 位置 | 说明 |
|------|------|------|
| systemd 服务文件 | `ai-gateway/ai-gateway.service` | 开机自启+自动重启 |
| 一键部署脚本 | `shell-scripts/server-setup.sh` | Nginx+Docker+Python+安全 |
| 日志分析脚本 | `shell-scripts/nginx-log-analyzer.sh` | 状态码/IP/流量/异常分析 |
| SSL 续期脚本 | `shell-scripts/ssl-renewal.sh` | certbot 自动续期+Cron |
| 监控脚本 | `服务器 /root/monitor/monitor.sh` | CPU/内存/磁盘/网络+Docker |
| 速查表页面 | `网站 /linux-cheatsheet.html` | 7大类命令，覆盖文件/进程/网络/服务/包管理/权限/文本处理 |

---

## 周四～周五 检查清单

- [ ] `ai-gateway.service` 文件已创建，`systemctl status` 显示 active
- [ ] `server-setup.sh` 可在新服务器上一键部署
- [ ] `nginx-log-analyzer.sh` 可以分析日志并输出报告
- [ ] `ssl-renewal.sh` 逻辑正确（不要求真实证书也能验证脚本语法）
- [ ] 监控 `monitor.sh` 通过 Cron 定时执行，快照文件正常生成
- [ ] `linux-cheatsheet.html` 页面可访问，命令行渲染正确
- [ ] shell-scripts 仓库已推送到 GitHub
- [ ] fail2ban + ufw 运行正常
