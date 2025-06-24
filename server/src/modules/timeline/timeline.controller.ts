import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TimelineService } from './timeline.service';
import { SlideAddDTO, TimelineAddDTO } from './timeline.dto';

@Controller('timeline')
export class TimelineController {
  constructor(private readonly timeSer: TimelineService) {}

  // 只返回时间段列表
  @Get()
  pureTimelineList() {
    return this.timeSer.pureList();
  }

  @Post()
  addTimeline(@Body() time: TimelineAddDTO) {
    const { name, weight } = time;
    return this.timeSer.addTimeline({ name, weight });
  }

  @Patch(':id')
  updateTimeline(@Param('id') id: string, @Body() timeline: TimelineAddDTO) {
    const { name, weight } = timeline;
    return this.timeSer.updateTimeline(id, { name, weight });
  }

  @Delete(':id')
  del(@Param('id') id: string) {
    return this.timeSer.deleteTimeline(id);
  }

  // 添加时间线 事件
  @Post('slide/:id')
  addSlide(@Param('id') id: string, @Body() slide: SlideAddDTO) {
    const {
      start_date,
      end_date,
      text,
      media,
      group,
      background,
      display_date,
      unique_id,
      autolink,
    } = slide;
    return this.timeSer.addSlide(id, {
      start_date,
      end_date,
      text,
      media,
      group,
      background,
      display_date,
      autolink,
      unique_id,
    });
  }
}
