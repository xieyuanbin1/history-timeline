import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import * as dayjs from 'dayjs';
import { RequestIdService } from 'src/modules/request-id/request-id.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly contextService: RequestIdService) {}

  intercept<T>(context: ExecutionContext, next: CallHandler<T>): Observable<T> | Promise<Observable<T>> {
    // console.log('before...')
    const logger = new Logger('API');
    const reqId = this.contextService.getRequestId();

    const req = context.switchToHttp().getRequest();
    const body = (req.method as string).toLowerCase() === 'get' ? JSON.stringify(req.query) : JSON.stringify(req.body);

    logger.log(
      `[${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')}] - [${reqId}] - [${
        req.url
      }] - [${req.method}] - request body: ${body}`,
    );

    return next.handle().pipe(
      // tap((data) => {
      //     console.log('after...')
      // })
      map((data: T) => {
        logger.log(
          `[${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')}] - [${reqId}] - [${
            req.url
          }] - [${req.method}] - response body: ${JSON.stringify(data)}`,
        );
        return data;
      }),
    );
  }
}
