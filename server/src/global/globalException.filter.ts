import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as dayjs from 'dayjs';
import { RequestIdService } from 'src/modules/request-id/request-id.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly contextService: RequestIdService) {}

  catch(exception: any, host: ArgumentsHost) {
    console.log('---- exception::', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let msg = exception.message || exception.msg;
    const logger = new Logger('API');
    const reqId = this.contextService.getRequestId();

    // ✅ 参数校验失败
    if (exception instanceof BadRequestException) {
      const res: any = exception.getResponse();
      const code = exception.getStatus();

      // class-validator 报错结构是 string[] 或 ValidationError[]
      if (Array.isArray(res.message)) {
        // 格式化为对象数组
        const msg = (res.message as string[]).join(',');
        // eslint-disable-next-line prettier/prettier
        logger.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')}] - [${reqId}] - [${request.url}] - [${request.method}] - response body: ${JSON.stringify({ code, msg })}`);
        return response.json({ status: code, message: msg });
      }
    }

    let status =
      exception instanceof HttpException ? exception.getStatus() : exception.code || HttpStatus.INTERNAL_SERVER_ERROR;

    // db exception
    if (exception.errno) {
      msg = exception.sqlMessage;
      status = exception.errno;
    }

    // 格式化输出
    if (status === 404) msg = `请求 ${request.url} 路径不存在`;
    const errData = {
      status: status,
      message: msg,
      // timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
      // path: request.url,
    };
    // console.error('>> GlobalExceptionFilter:', exception)
    // 捕获全局异常 统一处理
    // eslint-disable-next-line prettier/prettier
    logger.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')}] - [${reqId}] - [${request.url}] - [${request.method}] - response body: ${JSON.stringify(errData)}`);
    response.json(errData);
  }
}
