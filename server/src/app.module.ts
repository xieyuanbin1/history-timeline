import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.dev', '.env.test', '.env'],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (conf: ConfigService) => ({
        uri: conf.get<string>('MONGODB_URI'), // 如：mongodb://localhost:27017/mydb
        // user: conf.get<string>('DB_USER'),
        // pass: conf.get<string>('DB_PASS'),
        // dbName: conf.get<string>('DB_NAME'),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
