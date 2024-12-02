FROM node:22-slim

# 设置工作目录
WORKDIR /app

# 复制后端代码并安装依赖
COPY package*.json ./
RUN npm install

# 复制剩余代码
COPY . .
RUN npm run build

# 删除源文件 减小体积
RUN rm -rf /app/src


# 暴露端口（假设后端使用 3000 端口）
EXPOSE 3000

# 启动后端服务
CMD ["node", "dist/main.js"]
