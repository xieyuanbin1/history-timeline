import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TimelineModel } from '../../schemas/timeline.schema';
import { SlideModel } from '../../schemas/slide.schema';
import { SlideAddDTO, TimelineAddDTO } from './timeline.dto';

@Injectable()
export class TimelineService {
  constructor(
    @InjectModel(TimelineModel.name) private timeModel: Model<TimelineModel>,
    @InjectModel(SlideModel.name) private slideModel: Model<SlideModel>,
  ) {}

  pureList() {
    return this.timeModel.find();
  }

  async addTimeline(timeline: TimelineAddDTO) {
    const count = await this.timeModel.countDocuments({ name: timeline.name });
    if (count) {
      throw new HttpException('时间线名称重复', 10001);
    }
    return this.timeModel.create(timeline);
  }

  // 更新时间线名称
  async updateTimeline(id: string, timeline: TimelineAddDTO) {
    const count = await this.timeModel.countDocuments({ name: timeline.name });
    if (count) {
      throw new HttpException('时间线名称重复', 10001);
    }
    return this.timeModel.findByIdAndUpdate(id, timeline, { new: true });
  }

  // 删除时间线
  deleteTimeline(id: string) {
    return this.timeModel.findByIdAndDelete(id);
  }

  // 添加 事件
  addSlide(id: string, slide: SlideAddDTO) {
    return this.timeModel.findByIdAndUpdate(
      id,
      { $push: { events: slide } },
      { new: true },
    );
  }
}
