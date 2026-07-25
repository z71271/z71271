# Dockerfile 学习笔记

> 记录时间：2026年7月 | 状态：已完成

## 为什么学这个

之前我只会 `docker run` 和 `docker-compose up`，用的是别人写好的镜像。面试如果被问"Docker会到什么程度"，只能说"会基本操作"——毫无竞争力。学会写 Dockerfile 之后，我能把任何项目打包成镜像，这是从"使用者"到"构建者"的质变。

## 7个核心指令

### FROM

```dockerfile
FROM nginx:alpine
```

- 指定基础镜像
- 所有 Dockerfile 的第一行
- 优先用 `alpine` 版本（体积小3-5倍）

### RUN

```dockerfile
RUN apk add --no-cache curl
```

- 构建时执行命令（安装软件、下载依赖）
- 每个 RUN 产生一个新层 → 用 `&&` 合并多条命令

### COPY

```dockerfile
COPY ./html /usr/share/nginx/html/
```

- 把宿主机文件复制到镜像
- 和 ADD 的区别：COPY 只复制，ADD 还能解压 tar

### CMD

```dockerfile
CMD ["nginx", "-g", "daemon off;"]
```

- 容器启动时执行
- 与 RUN 的区别：RUN 构建时执行，CMD 运行时执行

### EXPOSE

```dockerfile
EXPOSE 80
```

- 声明容器监听的端口（仅文档作用）
- 真正的端口映射在 `docker run -p` 或 compose 里设置

### ENV

```dockerfile
ENV NGINX_PORT=80
```

- 设置环境变量，后续指令和运行时都可以用

### WORKDIR

```dockerfile
WORKDIR /usr/share/nginx/html
```

- 设置工作目录，后续 COPY/RUN/CMD 的相对路径都基于此

## 实操：把个人网站打包成镜像

```bash
# 构建
docker build -t zjy-website .

# 运行
docker run -d -p 8888:80 --name zjy-site zjy-website

# 一键 docker-compose up -d
```

## docker-compose 3个核心概念

1. **service**：一个服务 = 一个容器
2. **volume**：数据卷，容器删了数据还在
3. **network**：让多容器互相通信

## 踩坑记录

### 坑1：Docker Hub 连不上

阿里云服务器在国内，拉镜像超时。解决方案：配置国内镜像源。

### 坑2：docker-compose 版本不兼容

新版 Docker 把 compose 集成进去了，命令从 `docker-compose`（横杠）变成了 `docker compose`（空格）。

### 坑3：containerd shim 版本冲突

Docker Engine v29 + 独立 compose v1 不兼容，需要装 compose v2 插件。

## 总结

- Dockerfile 7个指令：FROM → RUN → COPY → CMD → EXPOSE → ENV → WORKDIR
- compose 3个概念：service / volume / network
- 一句话记住流程：Dockerfile → docker build → 镜像 → docker run → 容器
