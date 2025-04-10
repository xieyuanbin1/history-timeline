import {In, Repository} from "typeorm";
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

// 定义 slide 的完成数据
type SlideDetails = SlideEntity & {
  start_date: DateEntity;
  end_date?: DateEntity;
  media?: MediaEntity;
  background?: BackgroundEntity;
  text?: TextEntity;
};

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
    return this.timelineRepo.createQueryBuilder().select(['id', 'name']).getRawMany();
  }

  // 删除时间轴
  // 同时删除 timeline slide 及 slide 以下的
  async deleteTimeline(id: string) {
    const qr = AppDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const slides = await qr.manager.find(SlideEntity, { where: { pid: id } })
      const sids = slides.map(s => s.id);

      // 删除 media
      await qr.manager.delete(MediaEntity, { pid: In(sids) });
      await qr.manager.delete(BackgroundEntity, { pid: In(sids) });
      await qr.manager.delete(DateEntity, { pid: In(sids) });
      await qr.manager.delete(TextEntity, { pid: In(sids) });
      await qr.manager.delete(SlideEntity, { pid: id });
      await qr.manager.delete(TimelineEntity, { id });

      await qr.commitTransaction();
      return {};
    } catch (e) {
      await qr.rollbackTransaction();
      console.error('[delete timeline]::', e);
      throw errorCode.DB_FAILED;
    }
  }

  // 添加 timeline
  add(name: string) {
    const tl = this.timelineRepo.create({ name });
    return this.timelineRepo.save(tl);
  }

  // 插入 slide
  addSlide(pid: string, type: SlideFrom) {
    const sl = this.slideRepo.create({ pid, type });
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
    return this.slideRepo.createQueryBuilder()
      .select(['id', 'pid', 'type'])
      .where('pid=:pid', { pid: id })
      .andWhere('type=:type', {type: SlideFrom.TITLE})
      .getRawOne();
  }

  // 获取 title 详情 slide.id
  async getTitleDetail(id: string) {
    const details = await this.slideRepo.createQueryBuilder('sl')
      .select(['sl.id', 'sl.pid', 'sl.type'])
      .leftJoinAndMapOne('sl.start_date', DateEntity, 'sd', 'sl.id=sd.pid')
      .leftJoinAndMapOne('sl.end_date', DateEntity, 'ed', 'sl.id=ed.pid')
      .leftJoinAndMapOne('sl.media', MediaEntity, 'md', 'sl.id=md.pid')
      .leftJoinAndMapOne('sl.background', BackgroundEntity, 'bg', 'sl.id=bg.pid')
      .leftJoinAndMapOne('sl.text', TextEntity, 't', 'sl.id=t.pid')
      .where('sl.id=:id', {id})
      .getOne() as SlideDetails;
    const start_date = details.start_date && pick(details.start_date, ['year', 'month', 'day']);
    const end_date = details.end_date && pick(details.end_date, ['year', 'month', 'day']);
    const media = details.media && pick(details.media, ['url', 'thumbnail', 'title']);
    const background = details.background && pick(details.background, ['url', 'alt', 'color']);
    const text = details.text && pick(details.text, ['headline', 'text']);

    return { ...pick(details, ['id', 'pid', 'type']), start_date, end_date, media, background, text };
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
