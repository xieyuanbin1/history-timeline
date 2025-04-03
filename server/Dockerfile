FROM node:22-slim

# 设置工作目录
WORKDIR /app

# 安装 Python 和构建工具
RUN apt-get update && apt-get install -y python3 python3-pip build-essential

# 设置环境变量，确保 node-gyp 使用 Python3
ENV PYTHON /usr/bin/python3

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
