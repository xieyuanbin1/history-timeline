# 使用适合的 Node.js 镜像来构建 Vue 应用
FROM node:22-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制前端代码并安装依赖
COPY package*.json ./
RUN npm install

# 复制剩余代码并进行构建
COPY . .
RUN npm run build

# 使用 nginx 来服务静态文件
FROM nginx:stable-alpine

# 将构建好的文件拷贝到 nginx 的静态资源目录
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
