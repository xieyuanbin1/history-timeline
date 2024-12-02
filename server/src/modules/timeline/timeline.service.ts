import {Repository} from "typeorm";
import {Timeline} from "../../entity/Timeline.entity";
import {AppDataSource} from "../../dataSource";

export class TimelineService {
  private readonly timelineRepo: Repository<Timeline>;
  constructor() {
    this.timelineRepo = AppDataSource.getRepository(Timeline);
  }

  async list() {
    return this.timelineRepo.createQueryBuilder().select(['id', 'name', 'title', 'events']).getMany();
  }
}
