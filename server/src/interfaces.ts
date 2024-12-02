export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export interface ModuleMetadata {
  controllers?: Type<any>[];
}
