import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

interface RequestId {
  requestId: string;
}

@Injectable()
export class RequestIdService {
  private readonly storage = new AsyncLocalStorage<RequestId>();
  constructor() {}

  run<T>(context: RequestId, callback: () => T): T {
    return this.storage.run(context, callback);
  }

  // 生成 req_id 用于对应请求响应
  getRequestId(): string | undefined {
    return this.storage.getStore()?.requestId;
  }
}
