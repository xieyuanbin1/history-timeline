import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonLogger } from './modules/logger/logger.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './global/transform.interceptor';
import { GlobalExceptionFilter } from './global/globalException.filter';
import { RequestIdService } from './modules/request-id/request-id.service';
import { LoggerInterceptor } from './global/logger.interceptor';

const logger = new Logger('main');
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonLogger),
  });

  // 全局中间件生命周期中注入字增 ID 用于关联一个完成的 请求->响应
  const contextService = app.get(RequestIdService);

  // ✅ api 前缀
  app.setGlobalPrefix('/api/timeline');

  // ✅ 全局管道 用于处理参数校验格式化
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动去除 DTO 中未定义的字段
      forbidNonWhitelisted: false, // 如果传入未定义字段，抛出异常
      transform: true, // 自动将 payload 转换为 DTO 实例
    }),
  );

  // ✅ 全局响应格式化
  app.useGlobalInterceptors(new TransformInterceptor());

  // ✅ 全局错误拦截
  app.useGlobalFilters(new GlobalExceptionFilter(contextService));

  // ✅ 格式化日志输出
  app.useGlobalInterceptors(new LoggerInterceptor(contextService));

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);
  logger.log(`>>>> Server start on port: ${PORT}, enjoy it. <<<<`);
}
void bootstrap().then().catch();
