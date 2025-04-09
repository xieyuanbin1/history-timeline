import {Repository} from "typeorm";
import {TimelineEntity} from "../../entity/Timeline.entity";
import {AppDataSource} from "../../dataSource";
import {IBackground, IDate, IMedia, IText, TimelineAddEventDTO, TimelineAddTitleDTO} from "./timeline.dto";
import {errorCode} from "../../errorCode";
import {SlideEntity, SlideFrom} from "../../entity/Slide.entity";
import {DateEntity} from "../../entity/Date.entity";
import {TextEntity} from "../../entity/Text.entity";
import {MediaEntity} from "../../entity/Media.entity";
import {BackgroundEntity} from "../../entity/Background.entity";
import {pick} from "lodash";

export class TimelineService {
  private readonly timelineRepo: Repository<TimelineEntity>;
  private readonly slideRepo: Repository<SlideEntity>;
  private readonly dateRepo: Repository<DateEntity>;
  private readonly textRepo: Repository<TextEntity>;
  private readonly mediaRepo: Repository<MediaEntity>;
  private readonly bgRepo: Repository<BackgroundEntity>;
  constructor() {
    this.timelineRepo = AppDataSource.getRepository(TimelineEntity);
    this.slideRepo = AppDataSource.getRepository(SlideEntity);
    this.dateRepo = AppDataSource.getRepository(DateEntity);
    this.textRepo = AppDataSource.getRepository(TextEntity);
    this.mediaRepo = AppDataSource.getRepository(MediaEntity);
    this.bgRepo = AppDataSource.getRepository(BackgroundEntity);
  }

  // 只获取时间线
  async list() {
    return this.timelineRepo.createQueryBuilder().select(['id', 'name']).getMany();
  }

  // 添加 timeline
  add(name: string) {
    const tl = this.timelineRepo.create({ name });
    return this.timelineRepo.save(tl);
  }

  // 插入 slide
  addSlide(pid: string, from: SlideFrom) {
    const sl = this.slideRepo.create({ pid, from });
    return this.slideRepo.save(sl)
  }

  // 插入 date
  addDate(pid: string, type: number, date: IDate) {
    const dt = this.dateRepo.create(Object.assign({}, { pid, type }, date));
    return this.dateRepo.save(dt);
  }

  // 插入 text
  addText(pid: string, text: IText) {
    const t = this.textRepo.create({ pid, ...text});
    return this.textRepo.save(t);
  }

  // 插入 media
  addMedia(pid: string, media: IMedia) {
    const m = this.mediaRepo.create({ pid, ...media });
    return this.mediaRepo.save(m);
  }

  // 插入 bg 数据
  addBg(pid: string, bg: IBackground) {
    const b = this.bgRepo.create({ pid, ...bg });
    return this.bgRepo.save(b);
  }

  // 获取 timeline -> title -> slide
  getTimeTileSlide(id: string) {
    return this.timelineRepo.createQueryBuilder('tl').select().leftJoin(SlideEntity, 'sl').where('tl.id=:id', { id }).andWhere('sl.pid=tl.id').andWhere('from=:from', {from: SlideFrom.TITLE}).getOne();
  }

  // 获取 title 详情
  getTitleDetail(id: string) {
    return this.slideRepo.createQueryBuilder('sl').select().leftJoinAndMapOne('sl.start_date', DateEntity, 'sd', 'sl.id=sd.pid', ).addSelect(['sd.year', 'sd.month', 'sd.day']).where('id=:id', { id }).getOne();
  }

  // 添加时间线 title 字段数据
  async addTitle(title: TimelineAddTitleDTO) {
    const { name, start_date, end_date, text, media, background } = title;
    const qr = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      // 添加 timeline 数据
      const timeline = await this.add(name);

      // 添加 slide 数据
      const slide = await this.addSlide(timeline.id, SlideFrom.TITLE);

      // 添加 start_date 数据
      await this.addDate(slide.id, 0, pick(start_date, ['year', 'month', 'day']));

      // 添加 end_date 数据
      if (end_date) {
        await this.addDate(slide.id, 1, pick(end_date, ['year', 'month', 'day']));
      }

      // 添加 text 数据
      if (text) {
        await this.addText(slide.id, pick(text, ['headline', 'text']));
      }

      // 添加 media 数据
      if (media) {
        await this.addMedia(slide.id, pick(media, ['url', 'thumbnail', 'title']));
      }

      // 添加 bg 数据
      if (background) {
        await this.addBg(slide.id, pick(background, ['url', 'alt', 'color']));
      }

      await qr.commitTransaction();
      return this.getTitleDetail(slide.id);
    } catch (error) {
      await qr.rollbackTransaction();
      console.error('[add title]::', error);
      throw errorCode.DB_FAILED;
    }
  }

  async addEvent(title: TimelineAddEventDTO) {}
}
