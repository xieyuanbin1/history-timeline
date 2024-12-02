import path from "path";
import {CONTROLLER_METADATA, PATH_METADATA, VALIDATE_METADATA} from "./constants";
import { isConstructor, isFunction } from "./utils";
import {JSONSchemaType} from "ajv";

// 从装饰器中解析 Controller 中 path 信息
export function resolveRoute(controllerClass: Function): { name: string; fn: Function; path: string, validate: JSONSchemaType<any> }[] {
  const prefix: string = Reflect.getMetadata(CONTROLLER_METADATA, controllerClass);
  const methodsNames: string[] = Object.getOwnPropertyNames(controllerClass.prototype).filter((item: string) => {
    return !isConstructor(item) && isFunction(controllerClass.prototype[item]);
  });

  return methodsNames.map((name: string) => {
    const fn = controllerClass.prototype[name];
    const route: string = Reflect.getMetadata(PATH_METADATA, fn);
    const validate: JSONSchemaType<any> = Reflect.getMetadata(VALIDATE_METADATA, fn);
    return { name, fn, validate, path: path.posix.join(prefix, route) };
  });
}

// 将 Controller 和 Post 装饰器映射到 map 中
export function addHandlers(root: Function, targetContainer: Map<string, any>) {
  const controllerList: Function[] = Reflect.getMetadata('controllers', root);
  // const routeList = controllerList.map(con => resolveRoute(con))
  for (const con of controllerList) {
    const routes = resolveRoute(con);
    for (const route of routes) {
      targetContainer.set(route.path, { fn: route.fn, proto: con, validate: route.validate });
    }
  }
}
