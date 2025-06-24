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

  // 添加 events 事件
  addEventsSlide(id: string, slide: SlideAddDTO) {
    return this.timeModel.findByIdAndUpdate(id, { $push: { events: slide } }, { new: true });
  }

  // 删除 events 事件
  deleteEventsSlide(timeId: string, slideId: string) {
    return this.timeModel.findByIdAndUpdate(timeId, { $pull: { events: { _id: slideId } } }, { new: true });
  }

  // 添加 title 事件
  async addTitleSlide(id: string, slide: SlideAddDTO) {
    const time = await this.timeModel.findById(id);
    if (time?.title) throw new HttpException('已存在标题信息', 10002);
    return this.timeModel.findOneAndUpdate(
      { _id: id, title: { $exists: false } },
      { $set: { title: slide } },
      { new: true },
    );
  }

  // 删除 title slide 数据
  deleteTitleSlide(timeId: string, slideId: string) {
    return this.timeModel.findByIdAndUpdate(timeId, { $unset: { title: 1 } }, { new: true });
  }
}
