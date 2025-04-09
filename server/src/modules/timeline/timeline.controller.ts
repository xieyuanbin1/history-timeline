import {Controller, Post, Validate} from "../../decorators";
import {TimelineService} from "./timeline.service";
import {TimelineAddEventDTO, TimelineAddEventSchema, TimelineAddTitleDTO, TimelineAddTitleSchema} from "./timeline.dto";

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

  // 获取时间线中的 title 详细
  @Post('title/detail')
  async titleDetail(body: { id: string}) {
    const { id } = body;
    const slide = await this.timelineService.getTimeTileSlide(id);
    return this.timelineService.getTitleDetail(slide!.id);
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
