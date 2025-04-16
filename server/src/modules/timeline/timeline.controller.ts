import {Controller, Post, Validate} from "../../decorators";
import {TimelineService} from "./timeline.service";
import {
  TimelineAddEventDTO,
  TimelineAddEventSchema,
  TimelineAddTitleDTO,
  TimelineAddTitleSchema,
  TimelineIdDTO, TimelineIdSchema
} from "./timeline.dto";
import {pick} from "lodash";

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

  @Post('add/title')
  @Validate(TimelineAddTitleSchema)
  addTitle(body: TimelineAddTitleDTO ) {
    return this.timelineService.addTitle(body);
  }

  @Post('add/event')
  @Validate(TimelineAddEventSchema)
  addEvent(body: TimelineAddEventDTO ) {
    return this.timelineService.addEvent(body);
  }
}
