# 云服务器安全加固笔记

> 记录时间：2026年8月 | 状态：已完成

## 安全加固做了什么

| 安全措施 | 工具 | 作用 |
|----------|------|------|
| 防火墙 | UFW | 默认拒绝所有入站，只开放必要端口（22/80/443） |
| 防暴力破解 | fail2ban | 3次 SSH 登录失败自动封 IP 1小时 |
| SSH 密钥登录 | OpenSSH | 禁用密码登录，仅允许密钥认证 |
| 最小权限 | Linux 权限 | 非必要不用 root 跑服务 |

## 防火墙（UFW）

```bash
# 查看状态
ufw status verbose

# 默认策略
ufw default deny incoming   # 拒绝所有入站
ufw default allow outgoing  # 允许所有出站

# 按需开放端口
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS

# 删除规则
ufw delete 3       # 删除第3条规则

# 临时关闭
ufw disable
```

## 防暴力破解（fail2ban）

```bash
# 查看状态
fail2ban-client status
fail2ban-client status sshd

# 解封某个 IP
fail2ban-client set sshd unbanip 1.2.3.4

# 日志位置
tail -f /var/log/fail2ban.log
```

### 配置要点

`/etc/fail2ban/jail.local`:
- `bantime = 3600` — 封禁1小时
- `findtime = 600` — 10分钟内的失败累计
- `maxretry = 3` — 失败3次就封

## SSH 安全

### 推荐配置（/etc/ssh/sshd_config）

```ini
# 禁止 root 密码登录（保留密钥登录）
PermitRootLogin prohibit-password

# 完全禁止密码登录（确认密钥可用后再开）
PasswordAuthentication no

# 禁止空密码
PermitEmptyPasswords no

# 限制尝试次数
MaxAuthTries 3
```

### 密钥登录配置

```bash
# 本地生成密钥
ssh-keygen -t ed25519

# 复制公钥到服务器
ssh-copy-id root@8.138.195.245

# 之后直接 ssh root@8.138.195.245 无需密码
```

## 为什么禁用密码登录

密码可能被暴力破解（试 10000 次总有一次对的）。SSH 密钥长度 256 位，暴力破解需要的时间比宇宙年龄还长。这就是为什么生产环境都要求密钥登录。

## fail2ban vs UFW 的区别

- **UFW**：静态防火墙，"端口 22 可以连，端口 3306 不能连"
- **fail2ban**：动态防火墙，"有人连续输错3次密码，自动封他 IP 1小时"

两者配合使用：UFW 做第一层过滤，fail2ban 做第二层动态拦截。

## 踩坑记录

### 坑1：改了 sshd_config 后连不上服务器
原因：配置有语法错误。预防措施：改之前备份，改完后 `sshd -t` 检查语法，另开终端测试登录。

### 坑2：fail2ban 配置不生效
原因：改的 `jail.conf` 被升级覆盖了。应该改 `jail.local`（优先级更高，不会被覆盖）。

### 坑3：ufw enable 后 SSH 断了
原因：没有先 `ufw allow 22`。教训：开启防火墙前一定先确认 SSH 端口在白名单里。
