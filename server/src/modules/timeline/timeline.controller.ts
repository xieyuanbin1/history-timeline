import {Controller, Post, Validate} from "../../decorators";
import {TimelineService} from "./timeline.service";
import {TimelineAddDTO, TimelineAddSchema} from "./timeline.dto";

@Controller('timeline')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {
    this.timelineService = new TimelineService();
  }

  @Post()
  list() {
    return this.timelineService.list();
  }

  @Post('add')
  @Validate(TimelineAddSchema)
  add(body: TimelineAddDTO ) {
    console.log(body);
  }
}
