import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RequestIdMiddleware } from './modules/request-id/request-id.middleware';
import { RequestIdService } from './modules/request-id/request-id.service';
import { IdService } from './modules/request-id/id.service';
import { TimelineModule } from './modules/timeline/timeline.module';
import mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.dev', '.env.test', '.env'],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (conf: ConfigService) => ({
        uri: conf.get<string>('DB_URI'), // 如：mongodb://localhost:27017/my
        user: conf.get<string>('DB_USER'),
        pass: conf.get<string>('DB_PASS'),
        dbName: conf.get<string>('DB_NAME'),
        // authSource: conf.get<string>('MONGODB_AUTH_SOURCE') || 'admin',
        // 无限重连相关配置
        retryWrites: true,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 30000,
        heartbeatFrequencyMS: 10000,
        waitQueueTimeoutMS: 0, // 无限等待连接池
        maxPoolSize: 10,
        retryAttempts: Number.MAX_SAFE_INTEGER, // 有效的是 NestJS 自带的 retryAttempts 配置
        // 以下是 mongoose 的 native driver reconnect 机制的推荐设置
        // 注意，Mongoose v6.x 开始默认自动重连
      }),
    }),
    TimelineModule,
  ],
  controllers: [AppController],
  providers: [AppService, RequestIdService, IdService],
})
export class AppModule implements NestModule {
  constructor() {
    // 设置全局转换 添加 createAt updateAt 字段
    mongoose.plugin((schema) => {
      // schema.set('toJSON', {
      //   virtuals: true, // 保留 virtual 字段
      //   versionKey: false, // 去掉 __v
      //   transform: (_doc, ret) => {},
      // });
    });
  }
  configure(consumer: MiddlewareConsumer) {
    // '/'     匹配根路由
    // '*path' 匹配其他子路由
    // 保证所有模块都能获取到 RequestContextService 中的 getRequestId
    consumer
      .apply(RequestIdMiddleware)
      .forRoutes(
        { path: '*path', method: RequestMethod.ALL },
        { path: '/', method: RequestMethod.ALL },
      );
  }
}
