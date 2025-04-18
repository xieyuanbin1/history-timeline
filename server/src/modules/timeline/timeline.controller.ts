import {Controller, Post, Validate} from "../../decorators";
import {TimelineService} from "./timeline.service";
import {
  TimelineAddEventDTO,
  TimelineAddEventSchema,
  TimelineAddTitleDTO,
  TimelineAddTitleSchema,
  TimelineIdDTO,
  TimelineIdSchema,
  TimelineUpdateEventDTO,
  TimelineUpdateEventSchema,
  TimelineUpdateTitleDTO,
  TimelineUpdateTitleSchema
} from "./timeline.dto";

@Controller('timeline')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {
    this.timelineService = new TimelineService();
  }

  // 只获取时间线列表
  @Post('title')
  list() {
    return this.timelineService.list();
  }

  // 删除时间轴
  // 通过 timeline.id 删除及联下的所有数据(timeline, slide, text,,,)
  @Post('delete')
  @Validate(TimelineIdSchema)
  delTimeline(body: TimelineIdDTO) {
    const { id } = body;
    return this.timelineService.deleteTimeline(id);
  }

  // 获取时间线中的 title 详细
  @Post('title/detail')
  @Validate(TimelineIdSchema)
  async titleDetail(body: TimelineIdDTO) {
    const { id } = body;
    const title = await this.timelineService.getTimeTileSlide(id);
    let titleSlide;
    if (title) titleSlide = await this.timelineService.getTitleDetail(title!.id);

    const events = await this.timelineService.getTimeEventsSlide(id);
    const ids = events.map(event => event.id);
    const eventsSlide = await this.timelineService.getEventsDetail(ids);
    return { title: titleSlide, events: eventsSlide };
  }

  // 添加时间线 仅添加到 timeline
  @Post('add/title')
  @Validate(TimelineAddTitleSchema)
  addTitle(body: TimelineAddTitleDTO ) {
    return this.timelineService.addTitle(body);
  }

  // 更新时间线 id, name 仅更新 timeline.name
  @Post('update/title')
  @Validate(TimelineUpdateTitleSchema)
  updateTitle(body: TimelineUpdateTitleDTO ) {
    const { id, name } = body;
    return this.timelineService.updateTitle(id, name);
  }

  @Post('add/slide')
  @Validate(TimelineAddEventSchema)
  addEvent(body: TimelineAddEventDTO ) {
    return this.timelineService.addEvent(body);
  }

  @Post('update/slide')
  @Validate(TimelineUpdateEventSchema)
  updateSlide(body: TimelineUpdateEventDTO) {
    return this.timelineService.updateEvent(body);
  }

  @Post('delete/slide')
  @Validate(TimelineIdSchema)
  deleteSlide(body: TimelineIdDTO) {
    const { id } = body;
    return this.timelineService.deleteSlide(id);
  }
}
