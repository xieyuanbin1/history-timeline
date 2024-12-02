import express from 'express';
import { uniqueId } from 'lodash';
import { AppModule } from '../app.module';
import { addHandlers } from '../adapters';
import Ajv from "ajv";
import {errorCode} from "../errorCode";

export const router = express.Router();
export const routerMap = new Map();

// 将路由解析到 map 上
// AppModule 上挂载所有模块
// addHandlers 方法将装饰器 Controller 和 Post 数据解析到 map 上
// controllerHandle 再根据路由表将方法从 map 中取出
addHandlers(AppModule, routerMap);
routerMap.forEach((value, key) => {
  console.log(`LOG Mapped {${key}, ${value.fn.constructor.name} ${value.fn.name}}`);
});

// 从 map 中解析 controller 方法
export async function controllerHandle(path: string, body?: any): Promise<Record<string, any>> {
  if (routerMap.get(path)) {
    let data = {};
    const handler = routerMap.get(path);

    // 校验参数 如果 handler 上存在校验参数装饰器
    // 如果校验没有通过 则抛出参数错误
    const { validate: validateSchema } = handler;
    if (validateSchema) {
      const ajv = new Ajv({});
      const valid = ajv.validate(validateSchema, body);
      if (!valid) throw errorCode.INVALID_PARAMS;
    }

    if (handler.fn.constructor.name == 'Function') {
      data = handler.fn.call(new handler.proto(), body);
    } else if (handler.fn.constructor.name == 'AsyncFunction') {
      data = await handler.fn.call(new handler.proto(), body);
    }
    return data;
  } else {
    throw { code: 20201, msg: '接口不存在' };
  }
}

// 只解析 post 方法
// 参数 body
router.use(async (req, res) => {
  const id = uniqueId('api_');
  if (req.method.toLowerCase() !== 'post') {
    res.send({ code: 10000, msg: '不支持的请求方法, 请使用 POST 请求' });
    return;
  }
  try {
    console.log('[LOG]', `[${id}]`, '[path]', req.path, '[request]', JSON.stringify(req.body) || '{}');
    const data = await controllerHandle(req.path, req);
    console.log('[LOG]', `[${id}]`, '[path]', req.path, '[response]', JSON.stringify(data));
    res.send(Object.assign({ code: 0, msg: 'success' }, { data }));
  } catch (error: any) {
    console.log('[LOG]', `[${id}]`, '[path]', req.path, '[response]', '[error]', error.msg || error.message);
    res.send({ code: error.code || 10000, msg: error.msg || error.message });
  }
})
