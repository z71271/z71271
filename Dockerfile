# ============================================
# z71.z71.pw 个人网站 Docker 镜像
# ============================================

FROM nginx:alpine

LABEL maintainer="z71271"
LABEL description="郑敬耀个人技术展示网站"

# 复制网站所有静态文件到 Nginx 默认网页目录
COPY . /usr/share/nginx/html/

# 复制自定义 Nginx 配置（可选，但如果要支持404页面等需要）
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
