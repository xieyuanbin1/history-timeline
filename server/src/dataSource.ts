import { DataSource } from "typeorm";
import {Timeline} from "./entity/Timeline.entity";
import {Slide} from "./entity/Slide.entity";
import {Date} from "./entity/Date.entity";
import {Text} from "./entity/Text.entity";
import {Media} from "./entity/Media.entity";
import {Background} from "./entity/Background.entity";

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: `history.sqlite`,
  synchronize: false,
  logging: false,
  // entities: ['/entity/*.entity{.ts,.js}'],
  entities: [Timeline, Slide, Date, Text, Media, Background],
  migrationsRun: true,
  // migrationsTransactionMode: 'all',
  migrations: [`migrations/*.js`],
  subscribers: []
});
