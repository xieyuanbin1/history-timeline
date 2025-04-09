import { DataSource } from "typeorm";
import {TimelineEntity} from "./entity/Timeline.entity";
import {SlideEntity} from "./entity/Slide.entity";
import {DateEntity} from "./entity/Date.entity";
import {TextEntity} from "./entity/Text.entity";
import {MediaEntity} from "./entity/Media.entity";
import {BackgroundEntity} from "./entity/Background.entity";
import {ErasEntity} from "./entity/Eras.entity";

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: `history.sqlite`,
  synchronize: false,
  logging: false,
  // entities: ['/entity/*.entity{.ts,.js}'],
  entities: [TimelineEntity, SlideEntity, DateEntity, TextEntity, MediaEntity, BackgroundEntity, ErasEntity],
  migrationsRun: true,
  // migrationsTransactionMode: 'all',
  migrations: [`migrations/*.js`],
  subscribers: []
});
