import {Repository} from "typeorm";
import {TimelineEntity} from "../../entity/Timeline.entity";
import {AppDataSource} from "../../dataSource";

export class TimelineService {
  private readonly timelineRepo: Repository<TimelineEntity>;
  constructor() {
    this.timelineRepo = AppDataSource.getRepository(TimelineEntity);
  }

  async list() {
    return this.timelineRepo.createQueryBuilder().select(['id', 'name', 'title', 'events']).getMany();
  }
}
