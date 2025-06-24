import { Module } from '@nestjs/common';
import { TimelineController } from './timeline.controller';
import { TimelineService } from './timeline.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TimelineModel, TimelineSchema } from '../../schemas/timeline.schema';
import { SlideModel, SlideSchema } from '../../schemas/slide.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TimelineModel.name,
        schema: TimelineSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: SlideModel.name,
        schema: SlideSchema,
      },
    ]),
  ],
  controllers: [TimelineController],
  providers: [TimelineService],
})
export class TimelineModule {}
