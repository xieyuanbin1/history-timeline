import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestIdService } from './request-id.service';
import { IdService } from './id.service';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  constructor(
    private readonly contextService: RequestIdService,
    private readonly idService: IdService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = this.idService.next(); // 自增 ID

    this.contextService.run({ requestId }, () => {
      next(); // 整个请求流程上下文中都可以用 contextService.getRequestId()
    });
  }
}
