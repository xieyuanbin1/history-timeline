# car maintenance records

说明：\
这是为汽车保养记录做的一个程序 \
前端采用 vue/tsx 开发 \
后端采用 express/sqlite3 开发 \
推荐 docker 直接部署

## 使用方式

```shell
docker compose up -d
#docker-compose.yml 文件可以按照自己需求自定义配置
```

## 开发模式
- 可以进入到 server/web 目录运行
```shell
cd server
#npm install
npm run dev
```

```shell
cd web
#npm install
npm run dev
#前端项目依赖后端接口 确保后端服务已经启动
```

## 容器运行架构
- 前端在本地开发环境配置的 vite 代理为 127.0.0.1:3000
- 服务端定义的端口为 3000
- 前端在容器中使用 nginx 做静态服务及接口转发代理
- 容器中 nginx 代理将接口 /api 转发到 http://server:3000/api 下

## 后端服务架构
路由及参数校验通过装饰器解析处理
