import express from "express";
import bodyParser from "body-parser";
import {AppDataSource} from "./dataSource";
import {router} from "./router";
import cors from "cors";

const app = express();
const PORT = 3001;

// 默认根路由
// 这里好像没有用 会被 router 拦截
app.get('/', (_req, res) => {
  res.send('my car!')
})

app.use(cors({
  origin: 'http://server:8081',  // 前端地址，允许该地址的请求
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(bodyParser.json());
app.use('/api', router); // 利用装饰器解析路由绑定

if (!AppDataSource.isInitialized) {
  AppDataSource.initialize()
    .then(() => {
      console.log('[LOG] [DB] Database initialized!');
    })
    .catch((error: any) => {
      throw error;
    });
}

app.listen(PORT, () => {
  console.log(`APP listening on port ${PORT}, enjoy it.`)
})
