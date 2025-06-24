import { Module, Global } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonLogger } from './logger.service';

@Global()
@Module({
  imports: [WinstonModule.forRoot(winstonLogger)],
  exports: [WinstonModule],
})
export class LoggerModule {}
