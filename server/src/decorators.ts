import {CONTROLLER_METADATA, PATH_METADATA, VALIDATE_METADATA} from './constants';
import { ModuleMetadata } from './interfaces';
import {JSONSchemaType} from "ajv";

// controller 类上的装饰器
// 区分不同模块
// 作为路由前缀部分
export function Controller(route?: string): ClassDecorator {
  route = route && route.length ? route : '/';
  route = route.startsWith('/') ? route : `/${route}`;
  return target => {
    Reflect.defineMetadata(CONTROLLER_METADATA, route, target);
  };
}

// 模块装饰器
// 目前只在 app module 中使用
// 其他模块省略了 module 层 所以不使用
export function Module(metadata: ModuleMetadata): ClassDecorator {
  return target => {
    for (const property in metadata) {
      if (Object.prototype.hasOwnProperty.call(metadata, property)) {
        Reflect.defineMetadata(property, (metadata as any)[property], target);
      }
    }
  };
}

// 路由只解析 POST 请求
export function Post(path?: string): MethodDecorator {
  path = path && path.length ? path : '';
  return (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    return descriptor;
  };
}

// 参数校验装饰器
export function Validate<T>(schema: JSONSchemaType<T>): MethodDecorator {
  return (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    Reflect.defineMetadata(VALIDATE_METADATA, schema, descriptor.value);
    return descriptor;
  };
}
