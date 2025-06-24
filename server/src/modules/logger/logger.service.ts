import * as DailyRotateFile from 'winston-daily-rotate-file';
import { WinstonModuleOptions } from 'nest-winston';
import { utilities } from 'nest-winston';
import { Console } from 'winston/lib/winston/transports';
import { format } from 'winston';

const logLevel = process.env.LOG_LEVEL || 'info';
console.log('logLevel::', logLevel);

export const winstonLogger: WinstonModuleOptions = {
  transports: [
    new Console({
      level: logLevel,
      format: format.combine(
        utilities.format.nestLike('App', {
          prettyPrint: true,
        }),
      ),
    }),
    new DailyRotateFile({
      level: logLevel,
      dirname: 'logs',
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '14d',
      format: format.combine(format.timestamp(), format.json()),
    }),
    new DailyRotateFile({
      level: 'error',
      dirname: 'logs',
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '5m',
      maxFiles: '30d',
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
};
